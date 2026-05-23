import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';
import { useLoginMutation, useSyncCartMutation } from '../redux/api/userApi';
import { setCredentials } from '../redux/slices/authSlice';
import { selectCartItems, setCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [syncCart] = useSyncCartMutation();
  const localCart = useSelector(selectCartItems);

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials(data));

      // Cloud Cart Merge Logic
      const cloudCart = data.user.cart || [];
      const mergedCart = [...cloudCart.map(item => ({ product: item.product, quantity: item.quantity }))];
      
      localCart.forEach(localItem => {
        const existing = mergedCart.find(c => c.product._id === localItem.product._id);
        if (existing) {
          existing.quantity = Math.max(existing.quantity, localItem.quantity);
        } else {
          mergedCart.push(localItem);
        }
      });
      
      dispatch(setCart(mergedCart));
      if (mergedCart.length > 0 || localCart.length > 0) {
        syncCart(mergedCart); // Sync merged cart back to cloud
      }

      toast.success(`Welcome back, ${data.user.name}! ⚡`);
      navigate(from, { replace: true });
    } catch (err) { toast.error(err?.data?.message || 'Login failed'); }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl animate-pulse-slow" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-neon"><Zap className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold font-display text-gradient">TechZone</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-dark pl-10" placeholder="john@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-dark pl-10 pr-10" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-neon w-full mt-2">{isLoading ? 'Signing In...' : 'Sign In'}</button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign Up Free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
