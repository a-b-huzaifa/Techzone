import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// @desc  Get all users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await User.countDocuments();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  res.json({ success: true, users, total });
});

// @desc  Get user by ID (admin)
router.get('/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

// @desc  Update user role (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json({ success: true, user });
});

// @desc  Delete user (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

// @desc  Add/update shipping address
router.post('/address', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

export default router;
