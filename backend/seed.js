/**
 * Seed script – populates MongoDB with sample products, offers, and an admin user.
 * Run:  npm run seed
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");
const Offer = require("./models/Offer");
const Review = require("./models/Review");

const products = [
  { name: "Fresh Red Apples", description: "Crisp and juicy red apples, rich in fiber and antioxidants. Perfect for a healthy snack.", category: "Fruits", price: 120, originalPrice: 150, discount: 20, unit: "kg", stock: 100, rating: 4.5, reviewCount: 42, isFeatured: true, isBestSeller: true, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400" },
  { name: "Ripe Bananas", description: "Sweet and naturally ripened bananas, great source of potassium and instant energy.", category: "Fruits", price: 60, originalPrice: 70, discount: 14, unit: "dozen", stock: 80, rating: 4.3, reviewCount: 28, isFeatured: true, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" },
  { name: "Alphonso Mangoes", description: "Premium Alphonso mangoes from Ratnagiri. The king of fruits at its finest.", category: "Fruits", price: 350, originalPrice: 400, discount: 12, unit: "kg", stock: 50, rating: 4.8, reviewCount: 89, isBestSeller: true, image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=400" },
  { name: "Watermelon", description: "Fresh and hydrating watermelon, perfect for summer. Sweet and seedless variety.", category: "Fruits", price: 40, originalPrice: 50, discount: 20, unit: "piece", stock: 60, rating: 4.2, reviewCount: 15, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
  { name: "Fresh Tomatoes", description: "Farm-fresh red tomatoes. Rich in lycopene, vitamins C and K. Essential for Indian cooking.", category: "Vegetables", price: 40, originalPrice: 50, discount: 20, unit: "kg", stock: 120, rating: 4.1, reviewCount: 35, isFeatured: true, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400" },
  { name: "Potatoes", description: "Fresh farm potatoes. Versatile for curries, fries, and more. High in starch and fiber.", category: "Vegetables", price: 30, originalPrice: 35, discount: 14, unit: "kg", stock: 150, rating: 4.0, reviewCount: 22, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400" },
  { name: "Onions", description: "Fresh red onions essential for Indian cooking. Sharp flavor, long shelf life.", category: "Vegetables", price: 35, originalPrice: 45, discount: 22, unit: "kg", stock: 200, rating: 4.0, reviewCount: 18, image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400" },
  { name: "Spinach", description: "Fresh baby spinach leaves. Rich in iron and vitamins. Great for palak dishes.", category: "Vegetables", price: 25, originalPrice: 30, discount: 17, unit: "bunch", stock: 80, rating: 4.4, reviewCount: 20, isFeatured: true, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
  { name: "Amul Full Cream Milk", description: "Pure and fresh full cream milk from Amul. 500ml tetra pack. Rich in calcium and protein.", category: "Dairy", price: 35, originalPrice: 35, discount: 0, unit: "500ml", stock: 200, rating: 4.6, reviewCount: 67, isBestSeller: true, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400" },
  { name: "Amul Butter", description: "Pasteurized table butter from Amul. Smooth texture, perfect for spreading and cooking.", category: "Dairy", price: 56, originalPrice: 60, discount: 7, unit: "100g", stock: 100, rating: 4.7, reviewCount: 93, isBestSeller: true, image: "https://images.unsplash.com/photo-1589985270958-bf087b1d5ae6?w=400" },
  { name: "Paneer", description: "Fresh and soft cottage cheese. Made from pure full cream milk. Perfect for paneer dishes.", category: "Dairy", price: 90, originalPrice: 100, discount: 10, unit: "200g", stock: 60, rating: 4.5, reviewCount: 44, isFeatured: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
  { name: "Whole Wheat Bread", description: "Freshly baked whole wheat bread. High in fiber, no preservatives. Healthy choice for breakfast.", category: "Bakery", price: 45, originalPrice: 50, discount: 10, unit: "loaf", stock: 80, rating: 4.2, reviewCount: 31, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
  { name: "Farm Fresh Eggs", description: "Free-range farm fresh eggs. Rich in protein and essential amino acids. Pack of 12.", category: "Dairy", price: 84, originalPrice: 90, discount: 7, unit: "12 pcs", stock: 100, rating: 4.6, reviewCount: 52, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
  { name: "Basmati Rice", description: "Premium aged basmati rice. Long grain, aromatic, and fluffy when cooked. 5kg pack.", category: "Rice & Grains", price: 250, originalPrice: 280, discount: 11, unit: "5kg", stock: 80, rating: 4.5, reviewCount: 78, isBestSeller: true, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  { name: "Marie Gold Biscuits", description: "Classic Marie Gold biscuits. Light, crispy, and perfect with chai. 250g pack.", category: "Snacks", price: 30, originalPrice: 35, discount: 14, unit: "250g", stock: 200, rating: 4.3, reviewCount: 48, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400" },
  { name: "Tropicana Orange Juice", description: "100% pure orange juice with no added sugar or preservatives. Refreshing and nutritious.", category: "Beverages", price: 85, originalPrice: 95, discount: 11, unit: "1L", stock: 100, rating: 4.4, reviewCount: 36, isFeatured: true, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400" },
  { name: "Tata Tea Gold", description: "Premium assam tea blend. Rich, full-bodied flavor. Refreshing morning cup.", category: "Beverages", price: 120, originalPrice: 135, discount: 11, unit: "250g", stock: 150, rating: 4.7, reviewCount: 109, isBestSeller: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { name: "Dettol Soap", description: "Dettol original antibacterial soap. Protects from 100 illness causing germs. Pack of 4.", category: "Personal Care", price: 120, originalPrice: 140, discount: 14, unit: "4 pcs", stock: 100, rating: 4.5, reviewCount: 62, image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400" },
  { name: "Sunsilk Shampoo", description: "Sunsilk stunning black shine shampoo. For glossy and beautiful hair.", category: "Personal Care", price: 190, originalPrice: 220, discount: 14, unit: "340ml", stock: 80, rating: 4.2, reviewCount: 29, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400" },
  { name: "Surf Excel Detergent", description: "Surf Excel Quick Wash detergent. Removes tough stains in less water. 1kg pack.", category: "Household", price: 140, originalPrice: 160, discount: 12, unit: "1kg", stock: 100, rating: 4.4, reviewCount: 55, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca3f66?w=400" },
  { name: "Green Capsicum", description: "Fresh green bell peppers. Crunchy, mildly sweet, rich in Vitamin C.", category: "Vegetables", price: 50, originalPrice: 60, discount: 17, unit: "500g", stock: 90, rating: 4.1, reviewCount: 12, image: "https://images.unsplash.com/photo-1601001815894-4bb6c828d945?w=400" },
  { name: "Nescafe Classic Coffee", description: "Rich and aromatic instant coffee. Made from finest Arabica beans. 100g jar.", category: "Beverages", price: 230, originalPrice: 260, discount: 12, unit: "100g", stock: 120, rating: 4.6, reviewCount: 88, isFeatured: true, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" },
];

const offers = [
  { title: "20% OFF on Fresh Fruits", description: "Get 20% discount on all fresh fruits. Limited time offer!", discountType: "percentage", discountValue: 20, category: "Fruits", bgColor: "#e74c3c", isActive: true },
  { title: "15% OFF on Vegetables", description: "Save 15% on all fresh vegetables. Farm to table freshness!", discountType: "percentage", discountValue: 15, category: "Vegetables", bgColor: "#27ae60", isActive: true },
  { title: "Buy 1 Get 1 Free", description: "On selected dairy products. Buy any dairy item and get one free!", discountType: "bogo", discountValue: 0, category: "Dairy", bgColor: "#2980b9", isActive: true },
  { title: "Free Delivery Above ₹499", description: "Order groceries worth ₹499 or more and enjoy FREE delivery!", discountType: "free_delivery", discountValue: 0, minOrderAmount: 499, bgColor: "#8e44ad", isActive: true },
  { title: "Weekend Special – 10% OFF", description: "Every weekend, get 10% off on your total order. Happy shopping!", discountType: "percentage", discountValue: 10, category: "All", bgColor: "#e67e22", isActive: true },
  { title: "First Order – Flat ₹50 OFF", description: "New user? Get flat ₹50 off on your first order. Welcome aboard!", discountType: "flat", discountValue: 50, category: "All", couponCode: "FIRST50", bgColor: "#16a085", isActive: true },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Offer.deleteMany({});
    await Review.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Insert offers
    await Offer.insertMany(offers);
    console.log(`✅ Inserted ${offers.length} offers`);

    // Create admin user if not exists
    let admin = await User.findOne({ email: "admin@freshcart.com" });
    if (!admin) {
      admin = await User.create({
        name: "FreshCart Admin",
        email: "admin@freshcart.com",
        phone: "9999999999",
        password: "admin@123",
        isAdmin: true,
      });
      console.log("✅ Admin user created: admin@freshcart.com / admin@123");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Create a test user
    let testUser = await User.findOne({ email: "user@freshcart.com" });
    if (!testUser) {
      testUser = await User.create({
        name: "Test User",
        email: "user@freshcart.com",
        phone: "8888888888",
        password: "user@123",
        isAdmin: false,
      });
      console.log("✅ Test user created: user@freshcart.com / user@123");
    }

    // Insert sample reviews
    const sampleReviews = [
      { userId: testUser._id, productId: insertedProducts[0]._id, rating: 5, comment: "Absolutely fresh and delicious apples! Delivered within 2 hours. Highly recommended!" },
      { userId: testUser._id, productId: insertedProducts[4]._id, rating: 4, comment: "Good quality tomatoes. Fresh and firm. Will order again." },
      { userId: testUser._id, productId: insertedProducts[8]._id, rating: 5, comment: "Best milk I have had. Very fresh. FreshCart is my go-to grocery app!" },
    ];
    await Review.insertMany(sampleReviews);
    console.log("✅ Inserted 3 sample reviews");

    console.log("\n🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:     admin@freshcart.com / admin@123");
    console.log("Test User: user@freshcart.com  / user@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seed();
