const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ["percentage", "flat", "bogo", "free_delivery"], required: true },
    discountValue: { type: Number, default: 0 },
    category: { type: String, default: "All" },
    minOrderAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    image: { type: String, default: "" },
    bgColor: { type: String, default: "#4caf50" },
    isActive: { type: Boolean, default: true },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
