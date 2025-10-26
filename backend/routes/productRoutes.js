import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'assets'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Backend BASE_URL
const BASE_URL = process.env.BASE_URL || 'https://naturalnuts.onrender.com';

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    // 🔹 Sanitize old localhost URLs automatically
    const cleanedProducts = products.map((p) => {
      let cleanUrl = p.imageUrl || '';
      // remove any localhost or duplicate BASE_URL
      cleanUrl = cleanUrl.replace(/^https?:\/\/localhost:\d+/i, '')
                         .replace(BASE_URL, '')
                         .replace(/^\/+/, '');
      return {
        ...p.toObject(),
        imageUrl: `${BASE_URL}/${cleanUrl}`,
      };
    });

    res.json(cleanedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

// POST create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const imageUrl = `${BASE_URL}/assets/${req.file.filename}`;

    const newProduct = new Product({ name, price, imageUrl });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error });
  }
});

// PUT update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    let updateData = { name, price };

    if (req.file) {
      updateData.imageUrl = `${BASE_URL}/assets/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (error) {
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
