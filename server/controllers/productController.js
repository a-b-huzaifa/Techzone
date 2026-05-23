import Product from '../models/Product.js';

// @desc   Get all products with filtering, sorting, pagination
// @route  GET /api/products
export const getProducts = async (req, res) => {
  const {
    keyword, category, brand, minPrice, maxPrice,
    rating, sort, page = 1, limit = 12, featured, newArrival,
  } = req.query;

  const query = {};

  if (keyword) {
    let searchKeyword = keyword;
    const normalized = keyword.toLowerCase().trim();
    
    // Basic synonym and pluralization handling
    if (normalized === 'mice' || normalized.includes('mouse')) searchKeyword = 'mouse|mice';
    else if (normalized.includes('phone')) searchKeyword = 'phone|smartphone';
    else if (normalized.includes('tv') || normalized.includes('television')) searchKeyword = 'tv|television|display';
    else if (normalized.includes('earbud') || normalized.includes('headphone') || normalized.includes('airpod')) searchKeyword = 'headphone|earbud|airpod|audio';
    
    query.$or = [
      { name: { $regex: searchKeyword, $options: 'i' } },
      { description: { $regex: searchKeyword, $options: 'i' } },
      { brand: { $regex: searchKeyword, $options: 'i' } },
      { category: { $regex: searchKeyword, $options: 'i' } }
    ];
  }
  if (category) query.category = category;
  if (brand) query.brand = { $in: brand.split(',') };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };
  if (featured === 'true') query.isFeatured = true;
  if (newArrival === 'true') query.isNewArrival = true;

  const sortOptions = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    popular: { sold: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOptions[sort] || { createdAt: -1 })
    .limit(Number(limit))
    .skip(skip);

  res.json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    products,
  });
};

// @desc   Get single product
// @route  GET /api/products/:id
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
};

// @desc   Create product (admin)
// @route  POST /api/products
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

// @desc   Update product (admin)
// @route  PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
};

// @desc   Delete product (admin)
// @route  DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, message: 'Product deleted successfully' });
};

// @desc   Create/update review
// @route  POST /api/products/:id/reviews
export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    alreadyReviewed.rating = Number(rating);
    alreadyReviewed.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar?.url,
      rating: Number(rating),
      comment,
    });
  }

  product.calculateRating();
  await product.save();
  res.status(201).json({ success: true, message: 'Review submitted' });
};

// @desc   Get featured & new arrivals for homepage
// @route  GET /api/products/homepage
export const getHomepageProducts = async (req, res) => {
  const [featured, newArrivals, topRated, flashSale] = await Promise.all([
    Product.find({ isFeatured: true }).limit(8),
    Product.find().sort({ createdAt: -1 }).limit(8),
    Product.find({ rating: { $gte: 4 } }).sort({ rating: -1 }).limit(8),
    Product.find({ 'flashSale.isActive': true, 'flashSale.endTime': { $gt: new Date() } }).limit(4),
  ]);
  res.json({ success: true, featured, newArrivals, topRated, flashSale });
};

// @desc   Get product categories with counts
// @route  GET /api/products/categories
export const getCategories = async (req, res) => {
  const categories = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, categories });
};
