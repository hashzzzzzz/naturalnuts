import React, { useState, useEffect } from 'react';
import './ProductCard.css';

// ✅ Optional: set your backend base URL here if needed for relative paths
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';

const ProductCard = ({ product, onOrderClick }) => {
  const { _id, name, imageUrl, price } = product;
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 650);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extraMarginTop =
    isSmallScreen && name.length <= 8 ? 60 :
    isSmallScreen && name.length <= 17 ? 30 :
    isSmallScreen && name.length <= 25 ? 20 : 0;

  // ✅ Correct image handling
  const finalImageUrl = imageUrl
    ? imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
      ? imageUrl // use absolute URLs as-is
      : `${API_BASE_URL}/${imageUrl.replace(/^\/+/, '')}` // prepend backend for relative paths
    : null;

  return (
    <div className="product-card" data-id={_id}>
      <div className="left-side">
        <div className="left-content">
          <h2 className="h22">{name}</h2>
          <p className="p22" style={{ marginTop: extraMarginTop }}>
            1kg {price != null ? `$${price.toFixed(2)}` : 'No price yet'}
          </p>
        </div>
      </div>

      <div className="right-side">
        {finalImageUrl ? (
          <img src={finalImageUrl} alt={name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <button className="butoniporosite" onClick={() => onOrderClick(product)}>
        Porosite
      </button>
    </div>
  );
};

export default ProductCard;
