import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { selectCartItems, selectCartTotal, updateQuantity, removeFromCart, applyCoupon } from '../redux/slices/cartSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

const COUPONS = { TECH10: 10, SAVE20: 20, WELCOME15: 15 };

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const [coupon, setCoupon] = useState('');
  const { discount } = useSelector((s) => s.cart);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discountAmt = subtotal * (discount / 100);
  const total = subtotal - discountAmt + tax + shipping;

  const handleCoupon = () => {
    const pct = COUPONS[coupon.toUpperCase()];
    if (pct) dispatch(applyCoupon({ code: coupon, discount: pct }));
    else toast.error('Invalid coupon code');
  };

  if (items.length === 0) return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Add some awesome tech products!</p>
        <Link to="/products" className="btn-neon inline-flex items-center gap-2"><ShoppingBag className="w-4 h-4" />Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display text-white mb-8">Shopping Cart <span className="text-slate-500 text-xl">({items.length} items)</span></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.product._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="glass-card p-5 flex gap-4">
                  <Link to={`/products/${item.product._id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-dark-100 flex-shrink-0">
                    <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product._id}`} className="font-medium text-white hover:text-primary-400 transition-colors line-clamp-2">{item.product.name}</Link>
                    <p className="text-sm text-slate-500 mt-1">{item.product.brand}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 glass-card px-2 py-1">
                        <button onClick={() => dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1 }))} className="p-1 hover:text-white text-slate-400"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-sm font-semibold text-white">{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1 }))} className="p-1 hover:text-white text-slate-400"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => dispatch(removeFromCart(item.product._id))} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary-400" />Coupon Code</h3>
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter code" className="input-dark text-sm flex-1" />
                <button onClick={handleCoupon} className="btn-neon py-2 px-4 text-sm">Apply</button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Try: TECH10, SAVE20, WELCOME15</p>
            </div>

            {/* Order Summary */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount ({discount}%)</span><span>-${discountAmt.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tax (8%)</span><span className="text-white">${tax.toFixed(2)}</span></div>
                <div className="neon-divider my-2" />
                <div className="flex justify-between text-lg font-bold"><span className="text-white">Total</span><span className="text-gradient">${total.toFixed(2)}</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-neon w-full mt-5 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/products" className="btn-ghost w-full mt-3 text-center block">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
