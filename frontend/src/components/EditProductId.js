import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProductIDInput() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleGoToEdit = () => {
    if (id.trim()) {
      navigate(`/admin/edit-product/${id}`);
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
      <h2 style={{ marginBottom: '30px', color: '#2f855a' }}>Edit Product</h2>

      <input
        type="text"
        placeholder="Enter Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
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
        onClick={handleGoToEdit}
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
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#276749';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#2f855a';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Continue
      </button>
    </div>
  );
}
