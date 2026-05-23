import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { items: [], coupon: null };

const saveToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify({ items: state.items, coupon: state.coupon }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: (cartFromStorage.items || []).filter(item => item?.product?._id),
    coupon: cartFromStorage.coupon || null,
    discount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
        toast.success('Cart updated!');
      } else {
        state.items.push({ product, quantity });
        toast.success(`${product.name} added to cart!`);
      }
      saveToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
      toast.success('Removed from cart');
      saveToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity === 0) {
          state.items = state.items.filter((i) => i.product._id !== productId);
        }
      }
      saveToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
      localStorage.removeItem('cart');
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
      toast.success(`Coupon applied! ${action.payload.discount}% off`);
      saveToStorage(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      saveToStorage(state);
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon, setCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectDiscount = (state) => state.cart.discount;
