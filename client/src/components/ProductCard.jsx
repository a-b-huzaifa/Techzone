import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star, Eye, Zap } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { useToggleWishlistMutation } from '../redux/api/userApi';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { updateUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [toggleWishlist] = useToggleWishlistMutation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isWishlisted = user?.wishlist?.includes(product._id);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to add to wishlist');
    try {
      const result = await toggleWishlist(product._id).unwrap();
      dispatch(updateUser({ wishlist: result.wishlist }));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="product-card group h-full"
    >
      <Link to={`/products/${product._id}`} className="block h-full">
        
        {/* Image Container */}
        <div className="relative overflow-hidden bg-dark-100 aspect-square">
          {!imageLoaded && <div className="skeleton w-full h-full absolute inset-0" />}
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=TechZone'}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-neon transition-all disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`p-3 rounded-xl transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }} className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
              <Eye className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-red-500 text-white text-xs font-bold px-2 py-0.5">-{discount}%</span>
            )}
            {product.isNewArrival && (
              <span className="badge badge-primary text-xs">New</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-slate-700 text-slate-400 text-xs">Out of Stock</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="badge badge-warning text-xs flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Only {product.stock} left
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-primary-400 font-medium mb-1 uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-white font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(product.rating) ? 'star-filled fill-current' : 'text-slate-600'}`}
                />
              ))}
            </div>
            <span className="text-slate-500 text-xs">({product.numReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-slate-500 text-sm line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 rounded-lg bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white border border-primary-500/30 hover:border-primary-500 transition-all disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
