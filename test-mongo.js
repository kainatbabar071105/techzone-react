import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is not set.');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas...');
console.log('URI:', uri.replace(/\/\/.*@/, '//<credentials>@'));

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB Connection Successful!');
    console.log('Connected to:', mongoose.connection.db.databaseName);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });