const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

const specificImageUpdates = {
  // Milk & Dairy
  "Amul Taaza Toned Milk 500ml": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
  "Amul Gold Full Cream Milk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80",

  // Fruits & Veg & Spices
  "Ruby Red Pomegranate (Anaar)": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
  "Fresh Ginger (Adrak)": "https://images.unsplash.com/photo-1615485290176-92c2a046c433?w=600&auto=format&fit=crop&q=80",
  "Everest Turmeric Powder (Haldi)": "https://images.unsplash.com/photo-1615485290179-8472f8832a82?w=600&auto=format&fit=crop&q=80",

  // Rice & Atta & Grains
  "Fortune Sona Masoori Raw Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
  "Fortune Red Masoor Dal": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
  "India Gate Super Premium Basmati Rice": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&auto=format&fit=crop&q=80",
  "Organic Wheat Dalia": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
  "Organic White Quinoa": "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&auto=format&fit=crop&q=80",
  "24 Mantra Organic Brown Rice": "https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80",
  "Tata Sampann Whole Black Urad Dal": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80",
  "Heritage Raw Idli Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
  "Organic Kashmiri Red Rajma": "https://images.unsplash.com/photo-1514944288352-1ee824e2947b?w=600&auto=format&fit=crop&q=80",
  "Aashirvaad Whole Wheat Atta 10kg": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
  "Aashirvaad Multigrain Atta": "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80",
  "MTR Fine Rava / Suji": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
  "24 Mantra Organic Thick Poha": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
  "24 Mantra Organic Ragi Flour": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",

  // Dal & Pulses
  "Tata Sampann Unpolished Toor Dal": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
  "Tata Sampann Yellow Moong Dal": "https://images.unsplash.com/photo-1585994191611-72d00163bcd6?w=600&auto=format&fit=crop&q=80",
  "Tata Sampann Split White Urad Dal": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80",
  "Tata Sampann Chana Dal": "https://images.unsplash.com/photo-1585994191611-72d00163bcd6?w=600&auto=format&fit=crop&q=80",
  "Organic Whole Green Moong": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80",
  "Desi Black Chana": "https://images.unsplash.com/photo-1514944288352-1ee824e2947b?w=600&auto=format&fit=crop&q=80",
  "MTR Sambar Powder": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
  "Lijjat Urad Dal Papad": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",

  // Oil & Ghee
  "Fortune Sunlite Refined Sunflower Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
  "Fortune Sunlite Sunflower Oil 5L Can": "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop&q=80",
  "Freedom Filtered Groundnut Oil": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
  "Fortune Kachi Ghani Mustard Oil": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
  "Saffola Gold Rice Bran & Sunflower Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
  "Borges Extra Virgin Olive Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
  "Parachute 100% Pure Coconut Oil": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80",
  "KLF Coconad 100% Pure Coconut Oil": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
  "Amul Pure Cow Ghee 1L": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
  "Amul Pure Cow Ghee 500ml": "https://images.unsplash.com/photo-1589927986076-2d7fe0a130e7?w=600&auto=format&fit=crop&q=80",
  "Mother Dairy Pure Ghee": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80",
  "Amul Pasteurized Butter 500g": "https://images.unsplash.com/photo-1589927986076-2d7fe0a130e7?w=600&auto=format&fit=crop&q=80",
  "Amul Pasteurized Salted Butter 100g": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80",
  "Mothers Recipe Mango Pickle": "https://images.unsplash.com/photo-1589135233689-d534b83f0f78?w=600&auto=format&fit=crop&q=80",

  // Masala & Spices
  "Everest Royal Garam Masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
  "Everest Chicken Masala": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
  "Everest Shahi Biryani Masala": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",

  // Dairy & Yogurt
  "Amul Masti Dahi / Fresh Curd": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=80",
  "Mother Dairy Classic Curd": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
  "Epigamia Greek Yogurt Strawberry": "https://images.unsplash.com/photo-1567769541495-236b3b55c68b?w=600&auto=format&fit=crop&q=80",
  "Amul Masti Spiced Buttermilk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
  "Veeba Pasta & Pizza Sauce": "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600&auto=format&fit=crop&q=80",
  "Amul Fresh Malai Paneer": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
  "MTR Ready to Eat Paneer Butter Masala": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
  "Amul Processed Cheese Block": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80",
  "Amul Cheese Slices": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&auto=format&fit=crop&q=80",

  // Eggs & Bread
  "Farm Fresh White Eggs (Pack of 12)": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
  "Farm Fresh White Eggs (Pack of 6)": "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80",
  "Britannia 100% Whole Wheat Bread": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80",
  "Britannia Brown Bread": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80",

  // Snacks & Biscuits
  "Parle-G Gluco Biscuits Family Pack": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
  "Britannia Marie Gold Biscuits": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80",
  "Parle Monaco Salted Crackers": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
  "Britannia Good Day Butter Cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80",
  "Britannia Good Day Cashew Cookies": "https://images.unsplash.com/photo-1565071559227-20ab25b7685e?w=600&auto=format&fit=crop&q=80",
  "Britannia Bourbon Chocolate Cream Biscuits": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
  "Cadbury Oreo Original Vanilla Cream Biscuits": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
  "Parle Hide & Seek Choco Chip Biscuits": "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600&auto=format&fit=crop&q=80",
  "Sunfeast Dark Fantasy Choco Fills": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
  "Lay's Magic Masala Potato Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
  "Lay's Cream & Onion Potato Chips": "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=600&auto=format&fit=crop&q=80",
  "Kurkure Masala Munch": "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=600&auto=format&fit=crop&q=80",
  "Bingo Mad Angles Achaari Masti": "https://images.unsplash.com/photo-1613919113643-25732ec5e61f?w=600&auto=format&fit=crop&q=80",
  "Haldiram's Nagpur Bhujia Sev": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
  "Haldiram's Aloo Bhujia": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
  "Haldiram's Khatta Meetha Mixture": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
  "Nutraj Premium Whole Almonds (Badam)": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80",
  "Nutraj Premium Whole Cashews (Kaju)": "https://images.unsplash.com/photo-1536591375315-1988d6960920?w=600&auto=format&fit=crop&q=80",
  "Nutraj Premium Afghan Raisins (Kishmish)": "https://images.unsplash.com/photo-1595412431720-6d337f76378e?w=600&auto=format&fit=crop&q=80",

  // Beverages
  "Coca-Cola Original Soft Drink": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
  "Pepsi Soft Drink Bottle": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80",
  "Sprite Lemon Lime Soft Drink": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80",
  "Fanta Orange Soft Drink": "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&auto=format&fit=crop&q=80",
  "Thums Up Charged Soft Drink": "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&auto=format&fit=crop&q=80",
  "Maaza Mango Fruit Drink": "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
  "Frooti Mango Drink Tetra": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80",
  "Real Fruit Power Mixed Fruit Juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
  "Bisleri Mineral Water Bottle": "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&auto=format&fit=crop&q=80",
  "Bisleri Mineral Water Jug 5L": "https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=600&auto=format&fit=crop&q=80",
  "Cadbury Bournvita Chocolate Health Drink": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
  "Freshwrap Aluminium Foil 18 Metres": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80",

  // Instant & Household
  "Maggi 2-Minute Masala Noodles (6 Pack)": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
  "Maggi 2-Minute Masala Noodles (12 Pack)": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
  "Kissan Fresh Tomato Ketchup": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
  "Vim Lemon Dishwash Gel Bottle": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80",
  "Vim Dishwash Bar (Pack of 3)": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  "Harpic Power Plus Toilet Cleaner Original": "https://images.unsplash.com/photo-1584813470613-5a1c1cbd3d0d?w=600&auto=format&fit=crop&q=80",
  "Lizol Disinfectant Floor Cleaner Citrus": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80",
  "Exo Touch & Shine Dishwash Bar": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
  "Scotch-Brite Sponge Scrub Pad": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80",
  "All Out Ultra Power+ Refill": "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",

  // Chocolates & Sweets
  "Cadbury Dairy Milk Silk Chocolate Bar": "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80",
  "Cadbury Dairy Milk Fruit & Nut": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
  "Cadbury 5 Star Chocolate Bar": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80",
  "Nestle KitKat 4-Finger Chocolate": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
  "Nestle Munch Chocolate Wafel": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
  "Cadbury Perk Chocolate Bar": "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80",
  "Cadbury Gems Chocolate Surprise Pack": "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80",
  "Snickers Peanut Bar": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&auto=format&fit=crop&q=80",
  "Ferrero Rocher Premium Chocolates": "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&auto=format&fit=crop&q=80",
  "Haldiram's Juicy Gulab Jamun": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
  "Haldiram's Spongy Rasgulla": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
  "Haldiram's Desi Ghee Soan Papdi": "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=600&auto=format&fit=crop&q=80",

  // Detergents & Personal Care
  "Surf Excel Easy Wash Detergent Powder": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80",
  "Surf Excel Matic Top Load Liquid Detergent": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80",
  "Ariel Complete Detergent Powder": "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",
  "Tide Plus Double Power Detergent Powder": "https://images.unsplash.com/photo-1584813470613-5a1c1cbd3d0d?w=600&auto=format&fit=crop&q=80",
  "Shinex Oxo-Biodegradable Garbage Bags": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80",
  "Origami SoSoft 2-Ply Facial Tissues": "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80",
  "Head & Shoulders Anti-Dandruff Shampoo": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
  "Johnson's Baby Shampoo No More Tears": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
  "Sunsilk Black Shine Shampoo": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
  "Pantene Hairfall Solution Shampoo": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80",
  "Himalaya Purifying Neem Face Wash": "https://images.unsplash.com/photo-1556228722-d119f43e7977?w=600&auto=format&fit=crop&q=80",
  "Himalaya Extra Soft & Gentle Baby Soap": "https://images.unsplash.com/photo-1607006482602-76ca0fd2f88d?w=600&auto=format&fit=crop&q=80",
  "Pampers All-in-One Pants Diapers (L Size)": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80",
  "Pampers All-in-One Pants Diapers (M Size)": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
  "MamyPoko Pants Extra Absorb Diapers (L Size)": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80"
};

async function fixImages3() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    let updatedCount = 0;
    for (const [name, imageUrl] of Object.entries(specificImageUpdates)) {
      const res = await Product.updateMany(
        { name: name },
        { $set: { image: imageUrl } }
      );
      if (res.modifiedCount > 0) {
        updatedCount += res.modifiedCount;
        console.log(`Updated: ${name}`);
      }
    }

    console.log(`\nFix pass 3 complete! Total updated: ${updatedCount}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixImages3();
