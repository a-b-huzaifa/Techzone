import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Trash2 } from 'lucide-react';
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../../redux/api/userApi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllUsersQuery({ page, limit: 20 });
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRole = async (id, role) => {
    await updateRole({ id, role }).unwrap();
    toast.success('Role updated');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await deleteUser(id).unwrap();
    toast.success('User deleted');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display text-white flex items-center gap-3"><Users className="w-8 h-8 text-primary-400" />Manage Users</h1>
          <div className="glass-card px-4 py-2 text-sm text-slate-400">Total: <span className="text-white font-medium">{data?.total || 0}</span></div>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-slate-400">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.users?.map((user) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">{user.name?.charAt(0)}</div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRole(user._id, e.target.value)}
                        className={`text-xs rounded-lg px-2 py-1 outline-none cursor-pointer border transition-all ${user.role === 'admin' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-primary-500/10 border-primary-500/30 text-primary-400'}`}
                      >
                        <option value="user" className="bg-slate-800 text-white">User</option>
                        <option value="admin" className="bg-slate-800 text-white">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
