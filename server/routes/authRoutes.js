import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { register, login, logout, getMe, updateProfile, changePassword, toggleWishlist, getCart, syncCart } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/cart', protect, getCart);
router.put('/cart', protect, syncCart);

export default router;
