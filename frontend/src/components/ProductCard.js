import React, { useState, useEffect } from 'react';
import './ProductCard.css';

// Use your backend base URL for relative image paths
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';

const ProductCard = ({ product, onOrderClick }) => {
  const { _id, name, imageUrl, price } = product;
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Track screen size to adjust text margins
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 650);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extra margin for small screens based on name length
  const extraMarginTop =
    isSmallScreen && name.length <= 8 ? 60 :
    isSmallScreen && name.length <= 17 ? 30 :
    isSmallScreen && name.length <= 25 ? 20 : 0;

  // Determine final image URL
  const finalImageUrl = imageUrl
    ? imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
      ? imageUrl // use absolute URL from DB
      : `${API_BASE_URL}/${imageUrl.replace(/^\/+/, '')}` // prepend backend if relative
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
