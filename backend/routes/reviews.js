const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Helper to recalculate product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
    return;
  }
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10,
    numReviews: reviews.length,
  });
};

const mongoose = require('mongoose');

// @route   GET /api/reviews/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    let reviews = [];
    if (mongoose.Types.ObjectId.isValid(productId)) {
      reviews = await Review.find({ product: productId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });
    }
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error.message);
    res.json([]);
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user bought the product (verified purchase)
    const hasBought = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'Delivered',
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      title,
      comment,
      verified: !!hasBought,
    });

    await updateProductRating(productId);
    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    console.error('Create review error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRating(productId);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
