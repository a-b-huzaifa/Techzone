import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useGetOrderQuery } from '../redux/api/orderApi';

const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderQuery(id);
  const order = data?.order;

  if (isLoading) return <div className="pt-24 min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="pt-24 text-center py-20 text-slate-400">Order not found</div>;

  const currentStep = steps.indexOf(order.orderStatus);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" />Back to Orders</Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Order <span className="text-primary-400 font-mono">#{order._id.slice(-8).toUpperCase()}</span></h1>
            <p className="text-slate-400 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'} text-sm`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
        </div>

        {/* Progress Tracker */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="glass-card p-6 mb-6">
            <h3 className="font-semibold text-white mb-6">Order Status</h3>
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${i <= currentStep ? 'bg-gradient-to-br from-primary-500 to-cyan-500 shadow-neon' : 'bg-white/10'}`}>
                      {i < currentStep ? <CheckCircle className="w-5 h-5 text-white" /> : i === currentStep ? <Package className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-slate-500" />}
                    </div>
                    <span className={`text-xs mt-2 text-center ${i <= currentStep ? 'text-primary-400' : 'text-slate-600'}`}>{step}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-all ${i < currentStep ? 'bg-gradient-to-r from-primary-500 to-cyan-500' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{item.name}</p>
                      <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" />Shipping Address</h3>
              <div className="text-slate-400 text-sm space-y-1">
                <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-5 h-fit">
            <h3 className="font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-slate-400"><span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span></div>
              <div className="neon-divider my-2" />
              <div className="flex justify-between font-bold text-white"><span>Total</span><span className="text-gradient">${order.totalPrice?.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-slate-400">Payment Method</p>
              <p className="text-white text-sm font-medium capitalize">{order.paymentMethod}</p>
            </div>
            {order.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-slate-400">Tracking Number</p>
                <p className="text-primary-400 font-mono text-sm">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
