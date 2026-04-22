import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import QuantityPopup from './QuantityPopup';
import { useCart } from '../contexts/CartContext';
import './ProductList.css';
import logo from '../assets/naturalnutslogofin.png';

const ProductList = ({ products = [] }) => {
  const { dispatch } = useCart();
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowMore = () => setVisibleCount(prev => prev + 6);
  const handleOrderClick = (product) => setSelectedProduct(product);
  const handleClosePopup = () => setSelectedProduct(null);
  const handleSaveQuantity = (quantity) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price || 0,
        imageUrl: selectedProduct.imageUrl,
        quantity,
      },
    });
    setSelectedProduct(null);
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }, [products]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="product-list-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo22" />
      </div>

      <div className="product-grid">
        {visibleProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onOrderClick={handleOrderClick}
          />
        ))}
      </div>

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

      {selectedProduct && (
        <QuantityPopup
          product={selectedProduct}
          onSave={handleSaveQuantity}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default ProductList;
