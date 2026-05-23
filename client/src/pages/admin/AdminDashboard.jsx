import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, DollarSign, ArrowRight, Activity } from 'lucide-react';
import { useGetAllOrdersQuery } from '../../redux/api/orderApi';
import { useGetProductsQuery } from '../../redux/api/productApi';
import { useGetAllUsersQuery } from '../../redux/api/userApi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const adminLinks = [
  { href: '/admin/products', icon: Package, label: 'Products', color: 'from-primary-500 to-cyan-500' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders', color: 'from-violet-500 to-pink-500' },
  { href: '/admin/users', icon: Users, label: 'Users', color: 'from-amber-500 to-orange-500' },
];

const sampleChartData = [
  { name: 'Jan', revenue: 4000, orders: 24 },
  { name: 'Feb', revenue: 3000, orders: 18 },
  { name: 'Mar', revenue: 5000, orders: 30 },
  { name: 'Apr', revenue: 4500, orders: 27 },
  { name: 'May', revenue: 6000, orders: 36 },
  { name: 'Jun', revenue: 5500, orders: 33 },
];

const statusColors = { Pending: 'badge-warning', Processing: 'badge-primary', Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger' };

export default function AdminDashboard() {
  const { data: ordersData } = useGetAllOrdersQuery({});
  const { data: productsData } = useGetProductsQuery({ limit: 100 });
  const { data: usersData } = useGetAllUsersQuery({});

  const stats = [
    { label: 'Total Revenue', value: `$${(ordersData?.stats?.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10', trend: '+12%' },
    { label: 'Total Orders', value: ordersData?.total || 0, icon: ShoppingBag, color: 'text-primary-400', bg: 'bg-primary-500/10', trend: '+8%' },
    { label: 'Total Products', value: productsData?.total || 0, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10', trend: '+5%' },
    { label: 'Total Users', value: usersData?.total || 0, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+20%' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-white flex items-center gap-3"><LayoutDashboard className="w-8 h-8 text-primary-400" />Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, Admin! Here's what's happening.</p>
          </div>
          <div className="flex gap-3">
            {adminLinks.map((l) => (
              <Link key={l.href} to={l.href} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-br ${l.color} shadow-neon hover:opacity-90 transition-opacity`}>
                <l.icon className="w-4 h-4" />{l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                <span className="text-green-400 text-xs font-medium">{stat.trend}</span>
              </div>
              <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary-400" />Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={sampleChartData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" />Orders Per Month</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sampleChartData}>
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#f8fafc' }} />
                <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-white/5">
                  <th className="text-left pb-3">Order ID</th>
                  <th className="text-left pb-3">Customer</th>
                  <th className="text-left pb-3">Total</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ordersData?.orders?.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 font-mono text-primary-400">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 text-white">{order.user?.name}</td>
                    <td className="py-3 text-white font-medium">${order.totalPrice?.toFixed(2)}</td>
                    <td className="py-3"><span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td>
                    <td className="py-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
