import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, discountAmount } = req.body;
  if (!orderItems?.length) { res.status(400); throw new Error('No order items'); }

  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress, paymentMethod,
    itemsPrice, taxPrice, shippingPrice, totalPrice, discountAmount: discountAmount || 0,
    isPaid: paymentMethod !== 'cod',
    paidAt: paymentMethod !== 'cod' ? new Date() : null,
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
  }

  // Real-time notification
  req.app.get('io')?.emit('new-order', { orderId: order._id, userId: req.user._id });
  res.status(201).json({ success: true, order });
});

// Get my orders
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// Admin: Get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const total = await Order.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  // Revenue stats
  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);
  const stats = { totalRevenue: revenueAgg[0]?.totalRevenue || 0 };
  res.json({ success: true, orders, total, totalPages, stats });
});

// Admin: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      orderStatus: req.body.status,
      ...(req.body.status === 'Delivered' ? { deliveredAt: new Date(), isPaid: true, paidAt: new Date() } : {}),
    },
    { new: true }
  );
  req.app.get('io')?.emit('order-updated', { orderId: order._id, status: req.body.status });
  res.json({ success: true, order });
});

export default router;
