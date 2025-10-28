import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for temporary storage
const upload = multer({ dest: 'uploads/' });

// Example route to upload image to Cloudinary
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products', // optional folder in Cloudinary
    });
    // result.secure_url is the Cloudinary URL of uploaded image
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Routes
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Connect to MongoDB Atlas
const mongoURL = process.env.MONGO_URL;
if (!mongoURL) {
  console.error('❌ MONGO_URL not defined in environment variables');
  process.exit(1);
}

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Atlas connected');
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});
