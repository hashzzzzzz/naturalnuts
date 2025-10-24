import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';

const router = express.Router();

// Setup multer storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets'); // change from 'uploads' to 'assets'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


const upload = multer({ storage: storage });

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

// POST create product with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    // Image URL path accessible from frontend
    const imageUrl = `/assets/${req.file.filename}`;


    const newProduct = new Product({ name, price, imageUrl });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error });
  }
});

// PUT update product (optional: also update image)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    let updateData = { name, price };

    if (req.file) {
     updateData.imageUrl = `/assets/${req.file.filename}`;

    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error });
  }
});

// DELETE product by id
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
