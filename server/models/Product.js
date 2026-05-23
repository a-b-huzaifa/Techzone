import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  category:    { type: String, required: true, enum: ['Laptops','Smartphones','Tablets','Accessories','Gaming','Audio','Cameras','Wearables','TVs','Components'] },
  brand:       { type: String, required: true },
  stock:       { type: Number, required: true, default: 0, min: 0 },
  images:      [{ url: { type: String, required: true }, publicId: String }],
  specifications: { type: Map, of: String },
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  isFeatured:  { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  sold:        { type: Number, default: 0 },
  tags:        [String],
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

productSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = Math.round((total / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

export default mongoose.model('Product', productSchema);
