import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc   Register user
// @route  POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      wishlist: user.wishlist,
    },
  });
};

// @desc   Login user
// @route  POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password').populate('cart.product');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      wishlist: user.wishlist,
      cart: user.cart,
    },
  });
};

// @desc   Logout user
// @route  POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc   Get current user
// @route  GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name price images rating').populate('cart.product');
  res.json({ success: true, user });
};

// @desc   Update profile
// @route  PUT /api/auth/update-profile
export const updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
};

// @desc   Change password
// @route  PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
};

// @desc   Toggle wishlist
// @route  POST /api/auth/wishlist/:productId
export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);

  if (index === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(index, 1);
  }

  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

// @desc   Get user cart
// @route  GET /api/auth/cart
export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  res.json({ success: true, cart: user.cart });
};

// @desc   Sync user cart
// @route  PUT /api/auth/cart
export const syncCart = async (req, res) => {
  const { cart } = req.body;
  const user = await User.findById(req.user.id);
  user.cart = cart;
  await user.save();
  res.json({ success: true, cart: user.cart });
};
