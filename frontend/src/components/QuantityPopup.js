import { useState } from 'react';
import { calculateItemBasePrice, formatPrice } from '../cartPricing';
import './QuantityPopup.css';

const QuantityPopup = ({ product, onSave, onClose }) => {
  const [quantity, setQuantity] = useState('0.5');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantityNumber = Number.parseFloat(quantity);

    if (Number.isNaN(quantityNumber) || quantityNumber < 0.5) {
      setError('Sasia minimale eshte 0.5 kg.');
      return;
    }

    onSave(quantityNumber);
  };

  const quantityNumber = Number.parseFloat(quantity) || 0;
  const productPrice = calculateItemBasePrice({
    ...product,
    quantity: quantityNumber,
  });

  return (
    <div className="quantity-backdrop">
      <form className="quantity-dialog" onSubmit={handleSubmit}>
        {product.imageUrl && (
          <div className="quantity-product-image">
            <img src={product.imageUrl} alt={product.name} />
          </div>
        )}
        <h2>{product.name}</h2>
        <label htmlFor="quantity">Sa kg doni?</label>
        <input
          id="quantity"
          type="number"
          min="0.5"
          step="0.1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="quantity-error">{error}</p>}
        <div className="quantity-price-box">
          <div className="quantity-total-row">
            <span>Cmimi</span>
            <strong>{formatPrice(productPrice)}</strong>
          </div>
          {quantityNumber >= 0.5 && quantityNumber < 0.9 && (
            <p>+0.50 EUR per sasi me pak se 0.9kg</p>
          )}
        </div>
        <div className="quantity-actions">
          <button type="submit">Ruaj ne shporte</button>
          <button type="button" onClick={onClose}>Anulo</button>
        </div>
      </form>
    </div>
  );
};

export default QuantityPopup;
