const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.product");
    if (!cart) return res.json({ items: [], totalAmount: 0 });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Product is out of stock" });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    // Recalculate total
    const allProducts = await Product.find({ _id: { $in: cart.items.map((i) => i.product) } });
    cart.totalAmount = cart.items.reduce((sum, item) => {
      const p = allProducts.find((p) => p._id.toString() === item.product.toString());
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    const allProducts = await Product.find({ _id: { $in: cart.items.map((i) => i.product) } });
    cart.totalAmount = cart.items.reduce((sum, item) => {
      const p = allProducts.find((p) => p._id.toString() === item.product.toString());
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    const allProducts = await Product.find({ _id: { $in: cart.items.map((i) => i.product) } });
    cart.totalAmount = cart.items.reduce((sum, item) => {
      const p = allProducts.find((p) => p._id.toString() === item.product.toString());
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalAmount: 0 }
    );
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
