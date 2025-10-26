import React, { useState, useEffect } from 'react';
import './ProductCard.css';

// Base API URL (Render or environment)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';

const ProductCard = ({ id, name, imageUrl, price, onOrderClick }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 650);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let extraMarginTop = 0;
  if (isSmallScreen) {
    if (name.length <= 8) extraMarginTop = 60;
    else if (name.length <= 17) extraMarginTop = 30;
    else if (name.length <= 25) extraMarginTop = 20;
  }

  // ✅ Fix image URL
  let resolvedImageUrl = null;
  if (imageUrl) {
    let cleanUrl = imageUrl.trim().replace(/^"+|"+$/g, '');

    // Use the URL as-is if it's already absolute
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      resolvedImageUrl = cleanUrl;
    } else {
      // Otherwise prepend the API base URL for relative paths
      resolvedImageUrl = `${API_BASE_URL}/${cleanUrl.replace(/^\/+/, '')}`;
    }
  }

  return (
    <div className="product-card" data-id={id}>
      <div className="left-side">
        <div className="left-content">
          <h2 className="h22">{name}</h2>
          <p
            className="p22"
            style={{ marginTop: isSmallScreen ? `${extraMarginTop}px` : undefined }}
          >
            1kg {price != null ? `$${price.toFixed(2)}` : 'No price yet'}
          </p>
        </div>
      </div>

      <div className="right-side">
        {resolvedImageUrl ? (
          <img src={resolvedImageUrl} alt={name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <button className="butoniporosite" onClick={() => onOrderClick(id)}>
        Porosite
      </button>
    </div>
  );
};

export default ProductCard;
