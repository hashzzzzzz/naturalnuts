import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AddProductForm.css'; // same styling as AddProductForm

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com/'; // ensure trailing slash

export default function EditProduct() {
  const { id: productId } = useParams();

  const [form, setForm] = useState({ name: '', price: '', image: null });
  const [imageUrl, setImageUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // ✅ Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}api/products/${productId}`);
        const product = res.data;
        setForm({ name: product.name, price: product.price, image: null });
        setImageUrl(product.imageUrl || '');
      } catch (err) {
        console.error('Failed to load product:', err);
        alert('Error loading product details.');
      }
    };
    fetchProduct();
  }, [productId]);

  // ✅ Drag and Drop handlers
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
      setForm((prev) => ({ ...prev, image: file }));
      setImageUrl(URL.createObjectURL(file));
      if (fileInputRef.current) fileInputRef.current.value = null;
    } else {
      alert('Please drop a valid image file');
    }
  }, []);

  // ✅ File input change
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setForm((prev) => ({ ...prev, image: file }));
      setImageUrl(URL.createObjectURL(file));
    }
  }, []);

  // ✅ Submit handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', parseFloat(form.price));
      if (form.image) formData.append('image', form.image);

      const response = await axios.put(`${API_BASE_URL}api/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Show updated image
      if (response.data.imageUrl) setImageUrl(response.data.imageUrl);

      alert('✅ Product updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="add-product-form product-form" onSubmit={handleUpdate}>
      <h2>Edit Product</h2>

      <input
        type="text"
        placeholder="Product name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="input-field"
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
          style={{ display: 'none' }}
        />
      </div>

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        required
        min="0"
        className="input-field"
      />

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  );
}
