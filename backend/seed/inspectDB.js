const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function inspectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('=== DATABASE INSPECTION ===');
    console.log(`Connected DB: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collections:`);

    for (const col of collections) {
      const colName = col.name;
      const count = await mongoose.connection.db.collection(colName).countDocuments();
      const sample = await mongoose.connection.db.collection(colName).findOne();
      console.log(`\n-----------------------------------------`);
      console.log(`Collection: '${colName}' (Total Documents: ${count})`);
      if (sample) {
        console.log(`Sample Fields: ${Object.keys(sample).join(', ')}`);
        console.log(`Sample Document preview:`, JSON.stringify(sample, null, 2).slice(0, 300) + '...');
      } else {
        console.log(`Collection is empty.`);
      }
    }

    console.log(`\n===========================`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('DB Inspection Error:', err);
    process.exit(1);
  }
}

inspectDB();
