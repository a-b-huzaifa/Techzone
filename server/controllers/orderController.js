import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc   Create order
// @route  POST /api/orders
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, couponCode, discountAmount } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponCode,
    discountAmount,
    statusHistory: [{ status: 'Pending', note: 'Order placed' }],
  });

  // Update product stock and sold count
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  // Emit real-time notification to admin
  req.app.get('io').emit('new-order', { orderId: order._id, total: totalPrice });

  res.status(201).json({ success: true, order });
};

// @desc   Get user orders
// @route  GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name images');
  res.json({ success: true, orders });
};

// @desc   Get single order
// @route  GET /api/orders/:id
export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
};

// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'Processing';
  order.paymentResult = req.body;
  order.statusHistory.push({ status: 'Processing', note: 'Payment received' });

  const updatedOrder = await order.save();
  req.app.get('io').emit('order-updated', { orderId: order._id, status: 'Processing' });
  res.json({ success: true, order: updatedOrder });
};

// @desc   Update order status (admin)
// @route  PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, note });
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'Delivered') order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  req.app.get('io').emit('order-updated', { orderId: order._id, status });
  res.json({ success: true, order: updatedOrder });
};

// @desc   Get all orders (admin)
// @route  GET /api/orders
export const getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .populate('user', 'name email');

  // Admin stats
  const stats = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' }, totalOrders: { $sum: 1 } } },
  ]);

  res.json({ success: true, orders, total, stats: stats[0] });
};
