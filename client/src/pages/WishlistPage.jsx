import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMeQuery } from '../redux/api/userApi';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { data, isLoading } = useGetMeQuery();
  const wishlist = data?.user?.wishlist || [];

  if (isLoading) return <div className="pt-24 min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display text-white mb-8">My Wishlist <span className="text-slate-500 text-xl">({wishlist.length})</span></h1>

        {wishlist.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No items in wishlist</h3>
            <p className="text-slate-400 mb-6">Save products you love for later!</p>
            <Link to="/products" className="btn-neon inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
