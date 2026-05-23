import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { useCreateOrderMutation } from '../redux/api/orderApi';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const { discount } = useSelector((s) => s.cart);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discountAmt = subtotal * (discount / 100);
  const total = subtotal - discountAmt + tax + shipping;

  const onSubmit = async (data) => {
    if (step === 1) { setStep(2); return; }
    try {
      const order = await createOrder({
        orderItems: items.map((i) => ({ product: i.product._id, name: i.product.name, image: i.product.images?.[0]?.url, price: i.product.price, quantity: i.quantity })),
        shippingAddress: data,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        discountAmount: discountAmt,
      }).unwrap();
      dispatch(clearCart());
      setStep(3);
      setTimeout(() => navigate(`/orders/${order.order._id}`), 2000);
    } catch (err) {
      toast.error(err?.data?.message || 'Order failed');
    }
  };

  if (step === 3) return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center glass-card p-12 max-w-md">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
        <p className="text-slate-400">Redirecting to your order details...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {['Shipping', 'Payment'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-neon' : 'bg-white/10 text-slate-400'}`}>{i + 1}</div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{s}</span>
              {i < 1 && <div className="w-16 h-px bg-white/10 mx-2" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-400" />Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                      <input {...register('fullName', { required: 'Required' })} className="input-dark" placeholder="John Doe" />
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-slate-400 mb-1">Street Address</label>
                      <input {...register('street', { required: 'Required' })} className="input-dark" placeholder="123 Main St" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">City</label>
                      <input {...register('city', { required: 'Required' })} className="input-dark" placeholder="New York" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">State</label>
                      <input {...register('state', { required: 'Required' })} className="input-dark" placeholder="NY" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">ZIP Code</label>
                      <input {...register('zipCode', { required: 'Required' })} className="input-dark" placeholder="10001" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Country</label>
                      <input {...register('country', { required: 'Required' })} className="input-dark" placeholder="United States" defaultValue="United States" />
                    </div>
                  </div>
                  <button type="submit" className="btn-neon mt-6 w-full">Continue to Payment</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary-400" />Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[{ id: 'stripe', label: 'Credit/Debit Card (Stripe)', icon: '💳' }, { id: 'cod', label: 'Cash on Delivery', icon: '💵' }].map((m) => (
                      <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${paymentMethod === m.id ? 'border-primary-500 bg-primary-500/10' : 'glass-card hover:border-white/20'}`}>
                        <input type="radio" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="accent-primary-500" />
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-white font-medium">{m.label}</span>
                      </label>
                    ))}
                  </div>
                  {paymentMethod === 'stripe' && (
                    <div className="glass-card p-4 mb-4 space-y-3">
                      <input className="input-dark text-sm" placeholder="Card Number (1234 5678 9012 3456)" />
                      <div className="flex gap-3">
                        <input className="input-dark text-sm" placeholder="MM/YY" />
                        <input className="input-dark text-sm" placeholder="CVV" />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
                    <button type="submit" disabled={isLoading} className="btn-neon flex-1">{isLoading ? 'Placing Order...' : 'Place Order'}</button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="glass-card p-5 h-fit">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <img src={item.product.images?.[0]?.url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-400">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="neon-divider my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-slate-400"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-white text-base"><span>Total</span><span className="text-gradient">${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
