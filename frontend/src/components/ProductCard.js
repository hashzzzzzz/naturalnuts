import React, { useState, useEffect } from 'react';
import './ProductCard.css';

// ✅ Use dynamic backend URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';

const ProductCard = ({ id, name, imageUrl, price, onOrderClick }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 650);
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine margin-top for price on small screens
  let extraMarginTop = 0;
  if (isSmallScreen) {
    if (name.length <= 8) extraMarginTop = 60;
    else if (name.length <= 17) extraMarginTop = 30;
    else if (name.length <= 25) extraMarginTop = 20;
  }

  // ✅ Clean and resolve image URL safely
// ✅ Clean and resolve image URL safely
let resolvedImageUrl = null;
if (imageUrl) {
  const cleanUrl = imageUrl.replace(/^"+|"+$/g, '').trim();

  // If the URL already starts with http/https, use it as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    resolvedImageUrl = cleanUrl;
  } else {
    // Otherwise, prepend API_BASE_URL for relative paths
    resolvedImageUrl = `${API_BASE_URL}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
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
