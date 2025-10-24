import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AddProductForm.css'; // reuse the same CSS (or your shared CSS file)

// Dynamic API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';


export default function EditProduct() {
  const { id: productId } = useParams();

  const [form, setForm] = useState({ name: '', price: '', image: null });
  const [imageUrl, setImageUrl] = useState('');  // for preview
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch existing product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
        const product = res.data;
        setForm({ name: product.name, price: product.price, image: null });
        setImageUrl(product.imageUrl || ''); // Assuming your API returns imageUrl field
        setMessage('');
      } catch {
        // Do nothing on error — silently ignore fetching errors
      }
    };
    fetchProduct();
  }, [productId]);

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setForm({ ...form, image: file });
      setImageUrl(URL.createObjectURL(file));
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      alert('Please drop a valid image file');
    }
  }, [form]);

  // File input change
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setForm({ ...form, image: file });
      setImageUrl(URL.createObjectURL(file));
    }
  }, [form]);

  // Handle form update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      if (form.image) formData.append('image', form.image);

      await axios.put(`${API_BASE_URL}/api/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Product updated successfully.');
    } catch {
      setMessage('Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageClass = message.includes('successfully') ? 'message message-success' : 'message message-error';

  return (
    <form className="add-product-form product-form" onSubmit={handleUpdate}>
      <h2>Edit Product</h2>

      <input
        type="text"
        placeholder="Product name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="input-field"
        required
      />

      <div
        className={`drag-drop-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        aria-label="Drag and drop an image here or click to select one"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Product preview" className="image-preview" />
        ) : (
          <p>Drag & drop an image here, or click to select one</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          style={{ display: 'none' }}
        />
      </div>

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="input-field"
        required
        min="0"
        step="0.01"
      />

      <button className="submit-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Product'}
      </button>

      {message && <p className={messageClass}>{message}</p>}
    </form>
  );
}
