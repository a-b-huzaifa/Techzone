import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star, Shield, Truck, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useGetProductQuery, useCreateReviewMutation } from '../redux/api/productApi';
import { useToggleWishlistMutation } from '../redux/api/userApi';
import { addToCart } from '../redux/slices/cartSlice';
import { selectCurrentUser, updateUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { data, isLoading } = useGetProductQuery(id);
  const [toggleWishlist] = useToggleWishlistMutation();
  const [createReview, { isLoading: submitting }] = useCreateReviewMutation();

  const product = data?.product;
  const isWishlisted = user?.wishlist?.includes(product?._id);

  const handleAddToCart = () => dispatch(addToCart({ product, quantity: qty }));

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    const res = await toggleWishlist(product._id).unwrap();
    dispatch(updateUser({ wishlist: res.wishlist }));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      await createReview({ id, rating: reviewRating, comment: reviewComment }).unwrap();
      setReviewComment('');
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="skeleton rounded-2xl h-96" />
        <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-8 w-full" />)}</div>
      </div>
    </div>
  );

  if (!product) return <div className="pt-24 text-center py-20 text-slate-400">Product not found</div>;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div>
            <motion.div layoutId={`product-${id}`} className="glass-card overflow-hidden aspect-square mb-4">
              <img src={product.images?.[activeImg]?.url || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary-500 shadow-neon' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-primary">{product.category}</span>
              {product.stock === 0 ? <span className="badge badge-danger">Out of Stock</span> : <span className="badge badge-success">In Stock ({product.stock})</span>}
            </div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">{product.name}</h1>
            <p className="text-primary-400 font-medium mb-4">{product.brand}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'star-filled fill-current' : 'text-slate-600'}`} />)}</div>
              <span className="text-slate-400 text-sm">{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
                  <span className="badge bg-red-500 text-white">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-slate-400 leading-relaxed mb-8">{product.description}</p>

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 glass-card px-2 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 rounded-lg hover:bg-white/10 text-slate-300"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-semibold text-white">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 rounded-lg hover:bg-white/10 text-slate-300"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-neon flex items-center gap-2 flex-1 justify-center">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button onClick={handleWishlist} className={`p-3 rounded-xl border transition-all ${isWishlisted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'glass-card text-slate-400 hover:text-white'}`}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 flex items-center gap-3"><Truck className="w-4 h-4 text-cyan-400" /><span className="text-xs text-slate-400">Free shipping on $50+</span></div>
              <div className="glass-card p-3 flex items-center gap-3"><Shield className="w-4 h-4 text-green-400" /><span className="text-xs text-slate-400">1 Year Warranty</span></div>
            </div>

            {/* Specs */}
            {product.specifications && (
              <div className="mt-8">
                <h3 className="font-semibold text-white mb-4">Specifications</h3>
                <div className="glass-card p-4 space-y-2">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                      <span className="text-slate-400">{key}</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-display text-white mb-6">Customer Reviews</h2>
            {product.reviews?.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400">No reviews yet. Be the first to review!</div>
            ) : (
              <div className="space-y-4">
                {product.reviews?.map((review) => (
                  <motion.div key={review._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">{review.name?.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-white text-sm">{review.name}</p>
                          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'star-filled fill-current' : 'text-slate-600'}`} />)}</div>
                        </div>
                      </div>
                      {review.verifiedPurchase && <span className="badge badge-success text-xs">Verified Purchase</span>}
                    </div>
                    <p className="text-slate-400 text-sm">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="glass-card p-5 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((r) => (
                    <button key={r} type="button" onClick={() => setReviewRating(r)}>
                      <Star className={`w-6 h-6 ${r <= reviewRating ? 'star-filled fill-current' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Comment</label>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} placeholder="Share your experience..." className="input-dark resize-none" required />
              </div>
              <button type="submit" disabled={submitting} className="btn-neon w-full justify-center">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
