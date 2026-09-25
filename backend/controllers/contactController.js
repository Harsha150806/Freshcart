const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json({ message: "Message sent successfully! We will get back to you soon.", contact });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { submitContact, getContacts };
