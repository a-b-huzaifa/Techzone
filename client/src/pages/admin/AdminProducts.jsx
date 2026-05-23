import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Package } from 'lucide-react';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useUploadImagesMutation } from '../../redux/api/productApi';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', discount: '', category: 'Laptops', brand: '', stock: '', isFeatured: false, isNewArrival: false, images: [{ url: 'https://via.placeholder.com/400?text=Product' }] };
const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Gaming', 'Audio', 'Cameras', 'Wearables', 'TVs', 'Components'];

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useGetProductsQuery({ page, limit: 15 });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImagesMutation();

  const openCreate = () => { setForm(emptyForm); setEditProduct(null); setModal(true); };
  const openEdit = (p) => { 
    const baseP = p.originalPrice || p.price;
    const disc = baseP > p.price ? Math.round(((baseP - p.price) / baseP) * 100) : 0;
    setForm({ ...p, price: baseP, discount: disc || '', stock: p.stock }); 
    setEditProduct(p._id); 
    setModal(true); 
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage(formData).unwrap();
      setForm({ ...form, images: [{ url: res.url }] });
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    }
  };

  const handleSave = async () => {
    try {
      const basePrice = Number(form.price);
      const discountPct = Number(form.discount || 0);
      const finalPrice = basePrice - (basePrice * discountPct / 100);
      
      const payload = {
        ...form,
        originalPrice: basePrice,
        price: finalPrice,
        stock: Number(form.stock)
      };

      if (editProduct) {
        await updateProduct({ id: editProduct, ...payload }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created!');
      }
      setModal(false);
    } catch (err) { toast.error(err?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id).unwrap();
    toast.success('Product deleted');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display text-white flex items-center gap-3"><Package className="w-8 h-8 text-primary-400" />Manage Products</h1>
          <button onClick={openCreate} className="btn-neon flex items-center gap-2"><Plus className="w-4 h-4" />Add Product</button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-slate-400">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.products?.map((p) => (
                  <tr key={p._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-white font-medium text-sm line-clamp-1">{p.name}</p>
                          <p className="text-slate-500 text-xs">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="badge badge-primary text-xs">{p.category}</span></td>
                    <td className="p-4 text-white font-medium">${p.price}</td>
                    <td className="p-4"><span className={p.stock <= 5 ? 'text-red-400' : 'text-green-400'}>{p.stock}</span></td>
                    <td className="p-4 text-amber-400">★ {p.rating}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 transition-all"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex gap-2 mt-4 justify-center">
            {[...Array(data.totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-semibold transition-all ${page === i + 1 ? 'bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-neon' : 'glass-card text-slate-400 hover:text-white'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white text-lg">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="Product Name" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-dark resize-none" placeholder="Description" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-dark" placeholder="Price ($)" type="number" />
                <div className="relative">
                  <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="input-dark pr-8" placeholder="Discount (%)" type="number" min="0" max="100" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark">
                  {categories.map((c) => <option key={c} value={c} className="bg-slate-800 text-white">{c}</option>)}
                </select>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-dark" placeholder="Brand" />
              </div>
              <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-dark" placeholder="Stock Quantity" type="number" />
              <div className="flex flex-col gap-2">
                <input value={form.images?.[0]?.url || ''} onChange={(e) => setForm({ ...form, images: [{ url: e.target.value }] })} className="input-dark" placeholder="Image URL (or upload below)" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20 cursor-pointer" />
                {uploading && <p className="text-xs text-primary-400">Uploading...</p>}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-primary-500" />Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="accent-primary-500" />New Arrival
                </label>
              </div>
            </div>
            <button onClick={handleSave} disabled={creating || updating} className="btn-neon w-full mt-5 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />{creating || updating ? 'Saving...' : 'Save Product'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
