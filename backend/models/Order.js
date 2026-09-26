const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: { type: addressSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 40 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
