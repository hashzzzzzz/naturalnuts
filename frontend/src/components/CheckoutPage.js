import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { calculateCartPricing, calculateItemBasePrice, formatPrice } from '../cartPricing';
import Footer from './Footer';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state, removeFromCart, updateCartQuantity } = useCart();
  const pricing = calculateCartPricing(state.items);

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
                const subtotal = calculateItemBasePrice(item);

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
                <strong>{formatPrice(pricing.subtotal)}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Posta</span>
                <strong>{pricing.shipping === 0 ? 'Falas' : formatPrice(pricing.shipping)}</strong>
              </div>
              <p className="checkout-shipping-note">
                {pricing.shipping === 0
                  ? 'Posta eshte falas per porosite mbi 30 EUR.'
                  : 'Posta kushton 2 EUR per porosite nen 30 EUR.'}
              </p>
              <div className="checkout-summary-row checkout-summary-total">
                <span>Totali</span>
                <strong>{formatPrice(pricing.total)}</strong>
              </div>
              <button type="button" onClick={() => navigate('/pagesa')}>
                Vazhdo Porosine
              </button>
            </aside>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;
