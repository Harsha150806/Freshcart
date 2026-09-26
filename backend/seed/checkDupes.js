const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

async function checkDupes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const products = await Product.find({});
    console.log(`Total products in DB: ${products.length}`);

    const imageMap = {};
    products.forEach(p => {
      if (!imageMap[p.image]) {
        imageMap[p.image] = [];
      }
      imageMap[p.image].push({ id: p._id, name: p.name, category: p.category });
    });

    const dupes = Object.entries(imageMap).filter(([url, list]) => list.length > 1);

    console.log(`\nFound ${dupes.length} duplicate image URLs:\n`);
    dupes.forEach(([url, list], idx) => {
      console.log(`Dupe #${idx + 1} (${list.length} products share this image):`);
      list.forEach(p => console.log(`  - [${p.category}] ${p.name}`));
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDupes();
