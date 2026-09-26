const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Build order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const discount = cart.discountAmount || 0;
    const totalAmount = subtotal + deliveryFee - discount;

    // Estimate delivery: 2-3 days from now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      couponCode: cart.couponCode || '',
      estimatedDelivery,
      notes: notes || '',
    });

    // Update payment status if not COD
    if (paymentMethod !== 'COD') {
      order.paymentStatus = 'Paid';
      await order.save();
    }

    // Clear cart after order placed
    cart.items = [];
    cart.couponCode = '';
    cart.discountAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ message: 'Server error placing order' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Make sure the order belongs to the user (or is admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (['Delivered', 'Out for Delivery', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel order in ${order.orderStatus} status` });
    }

    order.orderStatus = 'Cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (admin)
// @access  Private/Admin
router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus === 'Delivered') order.deliveredAt = new Date();

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
