const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check if req.user exists (optional auth)
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      user: req.user ? req.user._id : null,
    });

    res.status(201).json({ message: 'Your message has been received! We will get back to you soon.', contact });
  } catch (error) {
    console.error('Contact error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
