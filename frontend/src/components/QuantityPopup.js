import { useState } from 'react';
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

  return (
    <div className="quantity-backdrop">
      <form className="quantity-dialog" onSubmit={handleSubmit}>
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
        <div className="quantity-actions">
          <button type="submit">Ruaj ne karte</button>
          <button type="button" onClick={onClose}>Anulo</button>
        </div>
      </form>
    </div>
  );
};

export default QuantityPopup;
