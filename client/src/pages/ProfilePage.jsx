import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Lock, MapPin, Heart, Save } from 'lucide-react';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../redux/api/userApi';
import { selectCurrentUser, updateUser } from '../redux/slices/authSlice';
import { useGetMeQuery } from '../redux/api/userApi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data } = useGetMeQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPwd }] = useChangePasswordMutation();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ name, phone }).unwrap();
      dispatch(updateUser(res.user));
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword({ currentPassword: currentPwd, newPassword: newPwd }).unwrap();
      toast.success('Password changed!');
      setCurrentPwd(''); setNewPwd('');
    } catch (err) { toast.error(err?.data?.message || 'Failed'); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card p-6 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-neon">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
            <span className={`badge mt-2 ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>{user?.role}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-neon' : 'glass-card text-slate-400 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5">Personal Information</h2>
            <form onSubmit={handleProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input value={user?.email} disabled className="input-dark opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-dark" placeholder="+1 234 567 8900" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="btn-neon flex items-center gap-2">
                <Save className="w-4 h-4" />{isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5">Change Password</h2>
            <form onSubmit={handlePassword} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Current Password</label>
                <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="input-dark" required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">New Password</label>
                <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input-dark" minLength={6} required />
              </div>
              <button type="submit" disabled={changingPwd} className="btn-neon flex items-center gap-2">
                <Lock className="w-4 h-4" />{changingPwd ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {data?.user?.wishlist?.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">No wishlist items</h3>
                <p className="text-slate-400 text-sm">Save products you love here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data?.user?.wishlist?.map((product) => (
                  <div key={product._id} className="glass-card p-4">
                    <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                    <p className="text-primary-400 font-bold">${product.price}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
