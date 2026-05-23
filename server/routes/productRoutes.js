import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, createReview, getHomepageProducts, getCategories,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/homepage', getHomepageProducts);
router.get('/categories', getCategories);
router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.route('/:id').get(getProduct).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, createReview);

export default router;
