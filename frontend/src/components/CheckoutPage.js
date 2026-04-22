import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import OrderPopup from './OrderPopup';
import Footer from './Footer';
import './CheckoutPage.css';

const formatPrice = (value) => `EUR ${Number(value || 0).toFixed(2)}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state, removeFromCart, updateCartQuantity } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);

  const handleQuantityChange = (productId, value) => {
    const quantity = Number.parseFloat(value);
    if (Number.isFinite(quantity) && quantity >= 0.5) {
      updateCartQuantity(productId, quantity);
    }
  };

  return (
    <>
      <main className="checkout-page">
        <section className="checkout-header">
          <h1>Karta juaj</h1>
          <p>Kontrolloni produktet dhe sasite para se te dergoni porosine.</p>
        </section>

        {state.items.length === 0 ? (
          <section className="checkout-empty">
            <h2>Karta eshte bosh</h2>
            <button type="button" onClick={() => navigate('/')}>
              Shiko Produktet
            </button>
          </section>
        ) : (
          <section className="checkout-layout">
            <div className="checkout-items">
              {state.items.map((item) => {
                const subtotal = item.price * Number(item.quantity);

                return (
                  <article className="checkout-item" key={item.id}>
                    <div className="checkout-item-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                    <div className="checkout-item-info">
                      <h2>{item.name}</h2>
                      <p>1kg {formatPrice(item.price)}</p>
                      <label>
                        Sasia kg
                        <input
                          type="number"
                          min="0.5"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="checkout-item-total">
                      <strong>{formatPrice(subtotal)}</strong>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Largo ${item.name} nga karta`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="checkout-summary">
              <h2>Totali</h2>
              <div className="checkout-summary-row">
                <span>Produkte</span>
                <strong>{state.itemCount}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Shuma</span>
                <strong>{formatPrice(state.total)}</strong>
              </div>
              <button type="button" onClick={() => setOrderOpen(true)}>
                Vazhdo Porosine
              </button>
            </aside>
          </section>
        )}
      </main>

      <Footer />

      {orderOpen && (
        <OrderPopup
          cartItems={state.items}
          onClose={() => setOrderOpen(false)}
        />
      )}
    </>
  );
};

export default CheckoutPage;
