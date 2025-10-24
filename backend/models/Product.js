import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,  // ✅ fixed type
  price: Number,
});

// 👇 This ensures it connects to 'produktet' collection
const Product = mongoose.model('Product', productSchema, 'produktet');

export default Product;
