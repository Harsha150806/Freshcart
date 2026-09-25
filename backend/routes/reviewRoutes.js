const express = require("express");
const router = express.Router();
const { createReview, getProductReviews, updateReview, deleteReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
