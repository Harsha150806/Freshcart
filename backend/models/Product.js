const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 }, // percentage
    category: {
      type: String,
      required: true,
      enum: [
        'Fruits & Vegetables',
        'Rice, Atta & Grains',
        'Dal & Pulses',
        'Oil & Ghee',
        'Masala & Spices',
        'Dairy, Bread & Eggs',
        'Snacks & Biscuits',
        'Beverages',
        'Instant & Packaged Food',
        'Chocolates & Sweets',
        'Cleaning & Household',
        'Personal Care',
        'Baby Care',
        'Pet Care',
      ],
    },
    image: { type: String, required: true },
    images: [String],
    unit: { type: String, default: 'piece' }, // kg, g, piece, litre, pack
    stock: { type: Number, default: 100, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    tags: [String],
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 24 },
    reviewCount: { type: Number, default: 24 },
    brand: { type: String, default: '' },
    weight: { type: String, default: '' },
    nutritionInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index for text search
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
