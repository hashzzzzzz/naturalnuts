import React, { useState, useEffect } from 'react';
import './ProductCard.css';

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

  // ✅ Use imageUrl exactly as it comes from DB if it starts with http/https
  const finalImageUrl =
    imageUrl?.startsWith('http://') || imageUrl?.startsWith('https://')
      ? imageUrl
      : imageUrl; // relative paths can stay as-is

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
