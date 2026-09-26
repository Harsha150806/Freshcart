const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name image price originalPrice discount unit stock isAvailable'
    );
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart or update quantity
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.isAvailable) return res.status(400).json({ message: 'Product not available' });
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items in stock` });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name image price originalPrice discount unit stock isAvailable');
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name image price originalPrice discount unit stock isAvailable');
    res.json(cart);
  } catch (error) {
    console.error('Update cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name image price originalPrice discount unit stock isAvailable');
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.couponCode = '';
      cart.discountAmount = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
