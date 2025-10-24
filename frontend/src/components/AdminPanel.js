import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);  // 600px breakpoint for mobile
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const desktopGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '50px',
  };

  const mobileGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '700px',
    margin: 'auto',
    marginTop: '50px',
    padding: '20px',
  };

  const mobileCardStyle = {
    border: '1px solid #ccc',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    transition: 'transform 0.2s ease',
  };

  const desktopCardStyle = {
    border: '1px solid #ccc',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'center',
  };

  const handleHover = (e, scale) => {
    e.currentTarget.style.transform = `scale(${scale})`;
  };

  const menuItems = [
    { label: 'Add Product', route: '/admin/add-product' },
    { label: 'Edit Product', route: '/admin/edit-product' },
    { label: 'Delete Product', route: '/admin/delete-product' },
    { label: 'Home', route: '/' },
  ];

  return (
    <div style={isMobile ? mobileGridStyle : desktopGridStyle}>
      {menuItems.map(item => (
        <div
          key={item.label}
          onClick={() => navigate(item.route)}
          onMouseEnter={isMobile ? (e) => handleHover(e, 1.03) : undefined}
          onMouseLeave={isMobile ? (e) => handleHover(e, 1) : undefined}
          style={isMobile ? mobileCardStyle : desktopCardStyle}
        >
          <h2 style={{ margin: 0 }}>{item.label}</h2>
        </div>
      ))}
    </div>
  );
}
