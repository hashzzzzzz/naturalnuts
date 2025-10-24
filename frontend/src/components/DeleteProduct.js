import React, { useState } from 'react';
import axios from 'axios';

// ✅ Dynamic backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DeleteProduct() {
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    if (!productId.trim()) {
      setMessage('Please enter a product ID.');
      return;
    }

    try {
      // ✅ Use dynamic backend URL
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`);
      setMessage('Product deleted successfully.');
      setProductId('');
    } catch (error) {
      setMessage('Failed to delete product. Make sure the ID is correct.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '80px auto',
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: '30px', color: '#2f855a' }}>Delete Product</h2>

      <input
        type="text"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 15px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1.5px solid #cbd5e0',
          fontSize: '16px',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#38a169')}
        onBlur={(e) => (e.target.style.borderColor = '#cbd5e0')}
      />

      <button
        onClick={handleDelete}
        style={{
          width: '100%',
          padding: '12px 0',
          backgroundColor: '#2f855a',
          color: '#fff',
          fontSize: '18px',
          fontWeight: '600',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(47, 133, 90, 0.4)',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#276749';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2f855a';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Delete
      </button>

      {message && (
        <p
          style={{
            marginTop: '20px',
            color: message.includes('successfully') ? '#2f855a' : '#e53e3e',
            fontWeight: '600',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
