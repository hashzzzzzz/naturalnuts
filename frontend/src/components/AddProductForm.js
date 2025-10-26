import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './AddProductForm.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback(e => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(e => { e.preventDefault(); setDragOver(false); }, []);
  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      if (fileInputRef.current) fileInputRef.current.value = null;
    } else alert('Please drop a valid image file');
  }, []);

  const handleFileChange = useCallback(e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageFile(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!imageFile) return alert('Please upload an image');

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', parseFloat(price));
      formData.append('image', imageFile);

      const response = await axios.post(`${API_BASE_URL}api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Product created:', response.data);
      alert('Product added successfully!');
      resetForm();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="add-product-form product-form" onSubmit={handleSubmit}>
      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={e => setName(e.target.value)}
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
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
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
          required={!imageFile}
        />
      </div>
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
        min="0"
        className="input-field"
      />
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProductForm;
