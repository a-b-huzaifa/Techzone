import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Menu, X, User, Heart, Zap,
  LogOut, LayoutDashboard, Package, ChevronDown
} from 'lucide-react';
import { logout, selectCurrentUser } from '../../redux/slices/authSlice';
import { selectCartCount, clearCart, selectCartItems } from '../../redux/slices/cartSlice';
import { useLogoutMutation, useSyncCartMutation } from '../../redux/api/userApi';

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Gaming', 'Audio', 'Accessories'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartCount);
  const cartItems = useSelector(selectCartItems);
  const [logoutApi] = useLogoutMutation();
  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path === '/products') return location.pathname === '/products' && !location.search;
    if (path.includes('?category=')) return location.search === path.substring(path.indexOf('?'));
    return location.pathname === path;
  };

  useEffect(() => {
    if (user && cartItems?.length > 0) {
      const formattedCart = cartItems.map(item => ({ 
        product: item?.product?._id || item?.product, 
        quantity: item?.quantity || 1 
      }));
      syncCart(formattedCart);
    } else if (user && cartItems?.length === 0) {
      syncCart([]);
    }
  }, [cartItems, user, syncCart]);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-200/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-neon">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              </div>
              <span className="text-xl font-bold font-display text-gradient">TechZone</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link 
                to="/" 
                className={`px-4 py-2 text-sm font-medium transition-all ${isActive('/') ? 'text-primary-400 border-b-2 border-primary-500 rounded-t-lg' : 'text-slate-300 hover:text-white hover:bg-white/5 rounded-lg'}`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`px-4 py-2 text-sm font-medium transition-all ${isActive('/products') ? 'text-primary-400 border-b-2 border-primary-500 rounded-t-lg' : 'text-slate-300 hover:text-white hover:bg-white/5 rounded-lg'}`}
              >
                Products
              </Link>
              {categories.slice(0, 4).map((cat) => {
                const path = `/products?category=${cat}`;
                return (
                  <Link
                    key={cat}
                    to={path}
                    className={`px-4 py-2 text-sm font-medium transition-all ${isActive(path) ? 'text-primary-400 border-b-2 border-primary-500 rounded-t-lg' : 'text-slate-300 hover:text-white hover:bg-white/5 rounded-lg'}`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Heart className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-neon"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-slate-300 max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-card p-2 shadow-card"
                      >
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                          <User className="w-4 h-4" />
                          <span className="text-sm">My Profile</span>
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                          <Package className="w-4 h-4" />
                          <span className="text-sm">My Orders</span>
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">Wishlist</span>
                        </Link>
                        {user.role === 'admin' && (
                          <>
                            <div className="neon-divider my-2" />
                            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-500/10 transition-all text-primary-400">
                              <LayoutDashboard className="w-4 h-4" />
                              <span className="text-sm font-medium">Admin Panel</span>
                            </Link>
                          </>
                        )}
                        <div className="neon-divider my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-all text-red-400 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                  <Link to="/register" className="btn-neon text-sm py-2 px-4">Sign Up</Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-dark-200/95 backdrop-blur-xl border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-1">
                {['/', '/products', ...categories.map(c => `/products?category=${c}`)].map((path, i) => (
                  <Link
                    key={i}
                    to={path}
                    className={`block px-4 py-3 text-sm font-medium transition-all ${isActive(path) ? 'text-primary-400 bg-white/5 border-l-4 border-primary-500 rounded-r-xl' : 'text-slate-300 hover:text-white hover:bg-white/5 rounded-xl'}`}
                  >
                    {i === 0 ? 'Home' : i === 1 ? 'All Products' : categories[i - 2]}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" className="btn-ghost text-sm py-2 px-4 flex-1 text-center">Login</Link>
                    <Link to="/register" className="btn-neon text-sm py-2 px-4 flex-1 text-center">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 glass-card p-4">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for laptops, phones, accessories..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-lg"
                />
                <button type="submit" className="btn-neon py-2 px-4 text-sm">Search</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
