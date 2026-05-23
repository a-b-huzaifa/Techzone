import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { useGetMyOrdersQuery } from '../redux/api/orderApi';

const statusColors = { Pending: 'badge-warning', Processing: 'badge-primary', Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger' };

export default function OrdersPage() {
  const { data, isLoading } = useGetMyOrdersQuery();

  if (isLoading) return <div className="pt-24 min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display text-white mb-8">My Orders</h1>

        {data?.orders?.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-slate-400 mb-6">Start shopping to see your orders here!</p>
            <Link to="/products" className="btn-neon inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.orders?.map((order, i) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/orders/${order._id}`} className="block glass-card p-5 hover:border-primary-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${statusColors[order.orderStatus] || 'badge-primary'}`}>{order.orderStatus}</span>
                      <span className="font-bold text-white">${order.totalPrice.toFixed(2)}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.orderItems?.slice(0, 4).map((item) => (
                      <img key={item._id} src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    ))}
                    {order.orderItems?.length > 4 && <span className="text-sm text-slate-400">+{order.orderItems.length - 4} more</span>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
