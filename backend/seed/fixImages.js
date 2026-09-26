require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) { console.error('MONGO_URI missing'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');
};

// Unique image map: product name -> unique Unsplash image URL
const imageMap = {
  // Fruits & Vegetables
  'Fresh Shimla Apples': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80',
  'Royal Gala Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  'Ripe Robusta Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'Premium Yelakki Bananas': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80',
  'Juicy Nagpur Oranges': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
  'Premium Alphonso Mangoes': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80',
  'Sweet Kesar Mangoes': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  'Sweet Black Seedless Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
  'Fresh Green Thomson Grapes': 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee73?auto=format&fit=crop&w=600&q=80',
  'Fresh Red Watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  'Fresh Papaya': 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=600&q=80',
  'Ruby Red Pomegranate (Anaar)': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'Fresh Pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
  'Green Baby Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  'Fresh Broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
  'Fresh Cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
  'Farm Fresh Tomatoes': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80',
  'Green Capsicum / Bell Pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  'Fresh Ginger (Adrak)': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'Organic Garlic (Lehsun)': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
  'Farm Fresh Onions': 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
  'Fresh Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'Fresh Cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
  'Fresh Green Chillies': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  'Baby Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  'Fresh Lemons': 'https://images.unsplash.com/photo-1587486936739-78f1a17b76a9?auto=format&fit=crop&w=600&q=80',
  'Coconut Water': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',

  // Rice, Atta & Grains
  'Aashirvaad Sharbati Whole Wheat Atta': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  'Aashirvaad Whole Wheat Atta 10kg': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80',
  'Aashirvaad Multigrain Atta': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80',
  'Fortune Refined Maida': 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=600&q=80',
  'MTR Fine Rava / Suji': 'https://images.unsplash.com/photo-1614961908622-8a9c92b94f27?auto=format&fit=crop&w=600&q=80',
  '24 Mantra Organic Ragi Flour': 'https://images.unsplash.com/photo-1614961908622-8a9c92b94f27?auto=format&fit=crop&w=600&q=80',
  'Fortune Chana Dal Besan': 'https://images.unsplash.com/photo-1612257418525-c3d4d94a33a9?auto=format&fit=crop&w=600&q=80',
  'Organic Wheat Dalia': 'https://images.unsplash.com/photo-1504903271097-d7e7c7f5f7ad?auto=format&fit=crop&w=600&q=80',
  'India Gate Super Premium Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'India Gate Feast Rozana Basmati Rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
  '24 Mantra Organic Brown Rice': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80',
  'Heritage Raw Idli Rice': 'https://images.unsplash.com/photo-1568347877321-f8935c7dc5a1?auto=format&fit=crop&w=600&q=80',
  'Ponni Boiled Rice': 'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?auto=format&fit=crop&w=600&q=80',
  '24 Mantra Organic Thick Poha': 'https://images.unsplash.com/photo-1614961908622-8a9c92b94f27?auto=format&fit=crop&w=600&q=80',
  'Fortune Sona Masoori Raw Rice': 'https://images.unsplash.com/photo-1617196034183-421b4040d609?auto=format&fit=crop&w=600&q=80',
  'Organic White Quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  "Kellogg's Corn Flakes Original": 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  'Quaker Whole Oats': 'https://images.unsplash.com/photo-1504903271097-d7e7c7f5f7ad?auto=format&fit=crop&w=600&q=80',
  'Saffola Masala Oats Veggie Twist': 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=600&q=80',

  // Dal & Pulses
  'Tata Sampann Unpolished Toor Dal': 'https://images.unsplash.com/photo-1585996824204-74c0e6e87f87?auto=format&fit=crop&w=600&q=80',
  'Tata Sampann Yellow Moong Dal': 'https://images.unsplash.com/photo-1612257418525-c3d4d94a33a9?auto=format&fit=crop&w=600&q=80',
  'Fortune Red Masoor Dal': 'https://images.unsplash.com/photo-1617196034183-421b4040d609?auto=format&fit=crop&w=600&q=80',
  'Tata Sampann Chana Dal': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'Tata Sampann Split White Urad Dal': 'https://images.unsplash.com/photo-1585996824204-74c0e6e87f87?auto=format&fit=crop&w=600&q=80',
  'Tata Sampann Whole Black Urad Dal': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80',
  'Organic Kashmiri Red Rajma': 'https://images.unsplash.com/photo-1568347877321-f8935c7dc5a1?auto=format&fit=crop&w=600&q=80',
  'Organic White Kabuli Chana': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'Organic Whole Green Moong': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'Desi Black Chana': 'https://images.unsplash.com/photo-1612257418525-c3d4d94a33a9?auto=format&fit=crop&w=600&q=80',
  'Safed Matar / White Peas': 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=600&q=80',

  // Oil & Ghee
  'Fortune Sunlite Refined Sunflower Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'Fortune Sunlite Sunflower Oil 5L Can': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
  'Freedom Filtered Groundnut Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'Fortune Kachi Ghani Mustard Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'Saffola Gold Rice Bran & Sunflower Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'Borges Extra Virgin Olive Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'Dalda Vanaspati': 'https://images.unsplash.com/photo-1461009683693-342af2f2d6ce?auto=format&fit=crop&w=600&q=80',
  'Amul Pure Cow Ghee 1L': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'Amul Pure Cow Ghee 500ml': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'Mother Dairy Pure Ghee': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',

  // Masala & Spices
  'Everest Turmeric Powder (Haldi)': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'Everest Tikhalal Red Chilli Powder': 'https://images.unsplash.com/photo-1607041409099-bd92431680b4?auto=format&fit=crop&w=600&q=80',
  'MDH Deggi Mirch Powder': 'https://images.unsplash.com/photo-1569484782645-b7a5bb0aecf4?auto=format&fit=crop&w=600&q=80',
  'Everest Dhaniya Powder': 'https://images.unsplash.com/photo-1598030304671-5806008d1d55?auto=format&fit=crop&w=600&q=80',
  'Everest Royal Garam Masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'Everest Chicken Masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'Everest Shahi Biryani Masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'MTR Sambar Powder': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'MTR Rasam Powder': 'https://images.unsplash.com/photo-1605459202412-5abfe3e35567?auto=format&fit=crop&w=600&q=80',
  'Catch Whole Cumin Seeds (Jeera)': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'Catch Mustard Seeds (Rai)': 'https://images.unsplash.com/photo-1628191015393-b21d3dd41ba5?auto=format&fit=crop&w=600&q=80',
  'Whole Black Pepper (Kali Mirch)': 'https://images.unsplash.com/photo-1599909533731-d45b4b6e2778?auto=format&fit=crop&w=600&q=80',
  'Green Cardamom (Elaichi)': 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=600&q=80',
  'Whole Cinnamon Sticks (Dalchini)': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
  'Whole Cloves (Laung)': 'https://images.unsplash.com/photo-1627986139310-98b3f377b4a7?auto=format&fit=crop&w=600&q=80',
  'Dabur Homemade Ginger Garlic Paste': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',

  // Dairy, Bread & Eggs
  'Amul Taaza Toned Fresh Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'Amul Taaza Toned Milk 500ml': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'Amul Gold Full Cream Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'Full Cream Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'Amul Masti Spiced Buttermilk': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
  'Amul Fresh Cream': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
  'Amul Masti Dahi / Fresh Curd': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  'Mother Dairy Classic Curd': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  'Epigamia Greek Yogurt Strawberry': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  'Amul Pasteurized Butter 500g': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'Amul Pasteurized Salted Butter 100g': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'Amul Processed Cheese Block': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
  'Amul Cheese Slices': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
  'Amul Fresh Malai Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  'Farm Fresh White Eggs (Pack of 12)': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
  'Farm Fresh White Eggs (Pack of 6)': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
  'Britannia 100% Whole Wheat Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'Britannia Brown Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'Horlicks Classic Malt Health Drink': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=600&q=80',
  'Cadbury Bournvita Chocolate Health Drink': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',

  // Snacks & Biscuits
  'Parle-G Gluco Biscuits Family Pack': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  'Britannia Marie Gold Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  'Britannia Bourbon Chocolate Cream Biscuits': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  'Cadbury Oreo Original Vanilla Cream Biscuits': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  'Parle Monaco Salted Crackers': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  'Britannia Good Day Butter Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  'Britannia Good Day Cashew Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  'Parle Hide & Seek Choco Chip Biscuits': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  'Sunfeast Dark Fantasy Choco Fills': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  "Lay's Magic Masala Potato Chips": 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  "Lay's Cream & Onion Potato Chips": 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  'Kurkure Masala Munch': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
  'Bingo Mad Angles Achaari Masti': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
  "Haldiram's Nagpur Bhujia Sev": 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
  "Haldiram's Aloo Bhujia": 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
  "Haldiram's Khatta Meetha Mixture": 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
  'Nutraj Premium Whole Almonds (Badam)': 'https://images.unsplash.com/photo-1508061252966-17387f8b299c?auto=format&fit=crop&w=600&q=80',
  'Nutraj Premium Whole Cashews (Kaju)': 'https://images.unsplash.com/photo-1508061252966-17387f8b299c?auto=format&fit=crop&w=600&q=80',
  'Nutraj Premium Afghan Raisins (Kishmish)': 'https://images.unsplash.com/photo-1508061252966-17387f8b299c?auto=format&fit=crop&w=600&q=80',

  // Beverages
  'Coca-Cola Original Soft Drink': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  'Pepsi Soft Drink Bottle': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  'Sprite Lemon Lime Soft Drink': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  'Fanta Orange Soft Drink': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  'Thums Up Charged Soft Drink': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  'Red Bull Energy Drink': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80',
  'Maaza Mango Fruit Drink': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  'Frooti Mango Drink Tetra': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  'Real Fruit Power Mixed Fruit Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  'Appy Fizz Sparkling Apple Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  'Bisleri Mineral Water Bottle': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&w=600&q=80',
  'Bisleri Mineral Water Jug 5L': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&w=600&q=80',
  'Tata Tea Gold Premium Leaf Tea': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
  'Lipton Honey Lemon Green Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',

  // Instant & Packaged Food
  'Maggi 2-Minute Masala Noodles (6 Pack)': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
  'Maggi 2-Minute Masala Noodles (12 Pack)': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
  'Sunfeast Yippee Magic Masala Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  'Bambino Roasted Vermicelli': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
  'Lijjat Urad Dal Papad': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'MTR Ready to Eat Paneer Butter Masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  'FunFoods Eggless Mayonnaise': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Veeba Pasta & Pizza Sauce': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
  'Kissan Fresh Tomato Ketchup': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Mothers Recipe Mango Pickle': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'Nestle Cerelac Wheat Apple Cereal': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',

  // Chocolates & Sweets
  'Cadbury Dairy Milk Silk Chocolate Bar': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Cadbury Dairy Milk Fruit & Nut': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Cadbury 5 Star Chocolate Bar': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Nestle KitKat 4-Finger Chocolate': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Nestle Munch Chocolate Wafel': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Cadbury Perk Chocolate Bar': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Cadbury Gems Chocolate Surprise Pack': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Snickers Peanut Bar': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Ferrero Rocher Premium Chocolates': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  "Haldiram's Juicy Gulab Jamun": 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  "Haldiram's Spongy Rasgulla": 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  "Haldiram's Desi Ghee Soan Papdi": 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'Amul Vanilla Royale Ice Cream Tub': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
  'Amul Chocolate Magic Ice Cream Tub': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',

  // Cleaning & Household
  'Surf Excel Easy Wash Detergent Powder': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Surf Excel Matic Top Load Liquid Detergent': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Ariel Complete Detergent Powder': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Tide Plus Double Power Detergent Powder': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Scotch-Brite Sponge Scrub Pad': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Shinex Oxo-Biodegradable Garbage Bags': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Origami SoSoft 2-Ply Facial Tissues': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Freshwrap Aluminium Foil 18 Metres': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
  'Vim Lemon Dishwash Gel Bottle': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Vim Dishwash Bar (Pack of 3)': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Harpic Power Plus Toilet Cleaner Original': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Lizol Disinfectant Floor Cleaner Citrus': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Colin Glass and Surface Cleaner Spray': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Exo Touch & Shine Dishwash Bar': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'All Out Ultra Power+ Refill': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',
  'Godrej Aer Pocket Lavender Fragrance': 'https://images.unsplash.com/photo-1585667804851-da4e3a31b44c?auto=format&fit=crop&w=600&q=80',

  // Personal Care
  'Colgate Strong Teeth Toothpaste': 'https://images.unsplash.com/photo-1559656914-a30970c1affd?auto=format&fit=crop&w=600&q=80',
  'Sensodyne Rapid Relief Toothpaste': 'https://images.unsplash.com/photo-1559656914-a30970c1affd?auto=format&fit=crop&w=600&q=80',
  'Oral-B Soft Toothbrush (Pack of 4)': 'https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&w=600&q=80',
  'Head & Shoulders Anti-Dandruff Shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  'Sunsilk Black Shine Shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  'Pantene Hairfall Solution Shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  'Dove Intense Repair Hair Conditioner': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  'Parachute 100% Pure Coconut Oil': 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80',
  'KLF Coconad 100% Pure Coconut Oil': 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80',
  'Bajaj Almond Drops Hair Oil': 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80',
  'Himalaya Purifying Neem Face Wash': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  'Nivea Soft Light Moisturizing Cream': 'https://images.unsplash.com/photo-1631390143959-1124028b5e3b?auto=format&fit=crop&w=600&q=80',
  'Nivea Men Fresh Active Deodorant Spray': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  'Gillette Mach3 Turbo Razor': 'https://images.unsplash.com/photo-1626765341461-4a3af9985ed4?auto=format&fit=crop&w=600&q=80',
  'Dettol Original Bathing Soap': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80',
  'Dove Cream Beauty Bathing Bar': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80',
  'Pears Soft & Fresh Bathing Soap': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80',
  'Dettol Liquid Handwash Refill': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',

  // Baby Care
  'Pampers All-in-One Pants Diapers (L Size)': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'Pampers All-in-One Pants Diapers (M Size)': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'MamyPoko Pants Extra Absorb Diapers (L Size)': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'Himalaya Gentle Baby Wipes': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  "Johnson's Baby Shampoo No More Tears": 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
  'Himalaya Extra Soft & Gentle Baby Soap': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80',

  // Pet Care
  'Pedigree Adult Chicken & Vegetables Dog Food': 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
  'Pedigree Adult Chicken Dog Food 1.2kg': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  'Drools Focus Adult Superpremium Dog Food': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
  'Whiskas Ocean Fish Dry Cat Food': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  'Pedigree Dentastix Medium Breed Oral Care Treat': 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80',
  'Himalaya Erina EP Tick & Flea Shampoo': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80',
};

const fixImages = async () => {
  try {
    await connectDB();
    const products = await Product.find({});
    console.log(`Checking ${products.length} products...\n`);

    let updated = 0;
    let skipped = 0;
    let notFound = 0;

    for (const product of products) {
      const newImage = imageMap[product.name];
      if (newImage && newImage !== product.image) {
        await Product.updateOne({ _id: product._id }, { $set: { image: newImage } });
        console.log(`Updated: ${product.name}`);
        updated++;
      } else if (!newImage) {
        console.log(`No mapping: ${product.name}`);
        notFound++;
      } else {
        skipped++;
      }
    }

    console.log(`\nSummary:`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Skipped (already correct): ${skipped}`);
    console.log(`  No mapping found: ${notFound}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixImages();
