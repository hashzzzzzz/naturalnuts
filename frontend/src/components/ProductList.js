import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import OrderPopup from './OrderPopup';
import './ProductList.css';
import logo from '../assets/naturalnutslogofin.png';

const ProductList = ({ products = [] }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Show 6 more products when clicked
  const handleShowMore = () => setVisibleCount((prev) => prev + 6);

  // Open order popup
  const handleOrderClick = (product) => setSelectedProduct(product);

  // Close order popup
  const handleClosePopup = () => setSelectedProduct(null);

  // 🔹 Memoized sorted products to avoid unnecessary re-sorting
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const alphaCompare = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      if (alphaCompare !== 0) return alphaCompare;
      return a.name.length - b.name.length;
    });
  }, [products]);

  // Only show products up to visibleCount
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="product-list-container">
      {/* Logo at top */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo22" />
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product._id || product.id} // safer key
            id={product._id || product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.price}
            onOrderClick={() => handleOrderClick(product)}
          />
        ))}
      </div>

      {/* Show More Button */}
      {visibleCount < sortedProducts.length && (
        <div className="button-center-wrapper">
          <button
            className="butoniporosite shiko-produktet-btn"
            onClick={handleShowMore}
          >
            Shiko Produkte
          </button>
        </div>
      )}

      {/* Order Popup */}
      {selectedProduct && (
        <OrderPopup product={selectedProduct} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ProductList;
