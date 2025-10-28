import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Multer for temporary local storage
const upload = multer({ dest: 'uploads/' });

// ✅ Backend BASE_URL
const BASE_URL = process.env.BASE_URL || 'https://naturalnuts.onrender.com';

// Cloudinary configuration (already done in server.js, but okay to double-check)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    const cleanedProducts = products.map((p) => {
      let cleanUrl = p.imageUrl || '';
      cleanUrl = cleanUrl.replace(/^https?:\/\/localhost:\d+/i, '')
                         .replace(BASE_URL, '')
                         .replace(/^\/+/, '');
      return {
        ...p.toObject(),
        imageUrl: p.imageUrl.startsWith('http') ? p.imageUrl : `${BASE_URL}/${cleanUrl}`,
      };
    });

    res.json(cleanedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

// POST create product → upload to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
    });

    const newProduct = new Product({
      name,
      price,
      imageUrl: result.secure_url, // Cloudinary URL
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create product', error });
  }
});

// PUT update product → upload to Cloudinary if new image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    let updateData = { name, price };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
      });
      updateData.imageUrl = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to update product', error });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete product', error });
  }
});

export default router;
