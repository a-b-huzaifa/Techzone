import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String, required: true },
    image:    { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true },
  }],
  shippingAddress: {
    fullName: String, street: String, city: String,
    state: String, zipCode: String, country: String,
  },
  paymentMethod:   { type: String, required: true, default: 'cod' },
  paymentResult:   { id: String, status: String, updateTime: String },
  itemsPrice:      { type: Number, required: true, default: 0 },
  taxPrice:        { type: Number, required: true, default: 0 },
  shippingPrice:   { type: Number, required: true, default: 0 },
  discountAmount:  { type: Number, default: 0 },
  totalPrice:      { type: Number, required: true, default: 0 },
  isPaid:          { type: Boolean, default: false },
  paidAt:          Date,
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  deliveredAt:    Date,
  trackingNumber: String,
  notes:          String,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
