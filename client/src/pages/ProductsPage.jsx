import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search } from 'lucide-react';
import { useGetProductsQuery } from '../redux/api/productApi';
import ProductCard from '../components/ProductCard';

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Gaming', 'Audio', 'Cameras', 'Wearables'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const params = {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page,
    limit: 12,
  };

  const { data, isLoading } = useGetProductsQuery(params);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
    setPage(1);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">
              {params.category || (params.keyword ? `"${params.keyword}"` : 'All Products')}
            </h1>
            <p className="text-slate-400 mt-1">{data?.total || 0} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={params.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-dark py-2 text-sm w-48">
              {sortOptions.map((o) => <option key={o.value} value={o.value} className="bg-slate-800 text-white">{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
            <div className="glass-card p-4">
              <h4 className="font-medium text-white mb-3 text-sm">Search</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." value={params.keyword} onChange={(e) => updateFilter('keyword', e.target.value)} className="input-dark pl-9 text-sm" />
              </div>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-medium text-white mb-3 text-sm">Category</h4>
              <div className="space-y-1">
                <button onClick={() => updateFilter('category', '')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!params.category ? 'bg-primary-500/20 text-primary-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>All</button>
                {categories.map((c) => (
                  <button key={c} onClick={() => updateFilter('category', c)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${params.category === c ? 'bg-primary-500/20 text-primary-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-medium text-white mb-3 text-sm">Price Range</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={params.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="input-dark text-sm" />
                <input type="number" placeholder="Max" value={params.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input-dark text-sm" />
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => <div key={i} className="glass-card overflow-hidden"><div className="skeleton h-48" /><div className="p-4 space-y-3"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-1/2" /></div></div>)}
              </div>
            ) : data?.products?.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.products?.map((product, i) => (
                    <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
                {data?.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {[...Array(data.totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-semibold transition-all ${page === i + 1 ? 'bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-neon' : 'glass-card text-slate-400 hover:text-white'}`}>{i + 1}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
