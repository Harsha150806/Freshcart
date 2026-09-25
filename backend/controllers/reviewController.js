const Review = require("../models/Review");
const Product = require("../models/Product");

// Helper: recalculate product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });
  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
  });
};

// @desc    Create review
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const existing = await Review.findOne({ userId: req.user._id, productId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    const review = await Review.create({ userId: req.user._id, productId, rating, comment });
    await updateProductRating(productId);
    const populated = await review.populate("userId", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();
    await updateProductRating(review.productId);
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { productId } = review;
    await review.deleteOne();
    await updateProductRating(productId);
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createReview, getProductReviews, updateReview, deleteReview };
