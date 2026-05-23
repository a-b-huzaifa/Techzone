import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl font-bold font-display text-gradient mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-neon flex items-center gap-2"><Home className="w-4 h-4" />Go Home</Link>
          <Link to="/products" className="btn-ghost flex items-center gap-2"><Search className="w-4 h-4" />Browse Products</Link>
        </div>
      </motion.div>
    </div>
  );
}
