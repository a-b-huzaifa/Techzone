import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors = { Pending: 'badge-warning', Processing: 'badge-primary', Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger' };

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({ page, limit: 20, status: filterStatus });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Order marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display text-white flex items-center gap-3"><ShoppingBag className="w-8 h-8 text-primary-400" />Manage Orders</h1>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-dark w-40 text-sm py-2">
            <option value="" className="bg-slate-800 text-white">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-slate-400">
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Items</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Payment</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.orders?.map((order) => (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 font-mono text-primary-400 text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4 text-white">{order.user?.name || 'N/A'}</td>
                    <td className="p-4 text-slate-400">{order.orderItems?.length} items</td>
                    <td className="p-4 text-white font-medium">${order.totalPrice?.toFixed(2)}</td>
                    <td className="p-4"><span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span></td>
                    <td className="p-4"><span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td>
                    <td className="p-4 text-slate-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatus(order._id, e.target.value)}
                        className="text-xs bg-dark-100 border border-white/10 rounded-lg px-2 py-1 text-white outline-none focus:border-primary-500 cursor-pointer"
                      >
                        {statuses.map((s) => <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>)}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {data?.orders?.length === 0 && <div className="text-center py-12 text-slate-400">No orders found</div>}
          </div>
        )}

        {data?.totalPages > 1 && (
          <div className="flex gap-2 mt-4 justify-center">
            {[...Array(data.totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-semibold transition-all ${page === i + 1 ? 'bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-neon' : 'glass-card text-slate-400 hover:text-white'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
