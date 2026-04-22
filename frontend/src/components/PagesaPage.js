import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { useCart } from '../contexts/CartContext';
import { calculateCartPricing, calculateItemBasePrice, formatPrice } from '../cartPricing';
import Footer from './Footer';
import './PagesaPage.css';

const PagesaPage = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const pricing = calculateCartPricing(state.items);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    city: '',
    street: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace('+383', '').replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, surname, street, phone } = formData;

    if (state.items.length === 0) {
      setErrorMsg('Shporta eshte bosh.');
      return false;
    }

    if (!/^[A-Za-z\s]{3,}$/.test(name)) {
      setErrorMsg('Emri duhet te permbaje vetem shkronja dhe te kete te pakten 3 karaktere.');
      return false;
    }

    if (!/^[A-Za-z\s]{4,}$/.test(surname)) {
      setErrorMsg('Mbiemri duhet te permbaje vetem shkronja dhe te kete te pakten 4 karaktere.');
      return false;
    }

    if (!/^[A-Za-z\s\d]{4,}$/.test(street)) {
      setErrorMsg('Rruga duhet te kete te pakten 4 karaktere dhe mund te permbaje numra.');
      return false;
    }

    if (!phone || !/^[04]/.test(phone)) {
      setErrorMsg('Numri i telefonit duhet te filloje me 0 ose 4.');
      return false;
    }

    if (phone.startsWith('0') && phone.length !== 9) {
      setErrorMsg('Numri i telefonit qe fillon me 0 duhet te permbaje 9 shifra pas prefix-it +383.');
      return false;
    }

    if (phone.startsWith('4') && phone.length !== 8) {
      setErrorMsg('Numri i telefonit qe fillon me 4 duhet te permbaje 8 shifra pas prefix-it +383.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const productLines = state.items.map((item) => (
      `${item.name} - ${item.quantity}kg - ${formatPrice(calculateItemBasePrice(item))}`
    ));

    const templateParams = {
      name: formData.name,
      surname: formData.surname,
      city: formData.city,
      street: formData.street,
      phone: `+383${formData.phone}`,
      email: formData.email,
      quantity: state.items.map((item) => `${item.name}: ${item.quantity}kg`).join(', '),
      product_name: state.items.map((item) => item.name).join(', '),
      products: productLines.join('\n'),
      shipping_price: pricing.shipping.toFixed(2),
      total_price: pricing.total.toFixed(2),
    };

    emailjs
      .send('service_e59cmkw', 'template_983i76o', templateParams, 'Ce9DUJpvpK1vhqbJY')
      .then(() => {
        setIsSubmitting(false);
        clearCart();
        setIsSuccess(true);
      })
      .catch(() => {
        setIsSubmitting(false);
        setErrorMsg('Gabim gjate dergimit te porosise. Ju lutem provoni perseri.');
      });
  };

  return (
    <>
      <main className="pagesa-page">
        <section className="pagesa-header">
          <h1>Pagesa</h1>
          <p>Plotesoni te dhenat per dergimin e porosise.</p>
        </section>

        {isSuccess ? (
          <section className="pagesa-success">
            <h2>Porosia juaj u dergua me sukses!</h2>
            <p>Pagesa behet Cash. Faleminderit per blerjen tuaj.</p>
            <button type="button" onClick={() => navigate('/')}>
              Kthehu ne balline
            </button>
          </section>
        ) : (
          <section className="pagesa-layout">
            <form className="pagesa-form" onSubmit={handleSubmit}>
              <h2>Te dhenat tuaja</h2>

              {errorMsg && <p className="pagesa-error">{errorMsg}</p>}

              <input name="name" placeholder="Emri" onChange={handleChange} required disabled={isSubmitting} />
              <input name="surname" placeholder="Mbiemri" onChange={handleChange} required disabled={isSubmitting} />
              <input name="city" placeholder="Qyteti" onChange={handleChange} required disabled={isSubmitting} />
              <input name="street" placeholder="Rruga(Nr-opsional)" onChange={handleChange} required disabled={isSubmitting} />
              <input
                type="text"
                name="phone"
                value={formData.phone ? `+383 ${formData.phone}` : ''}
                placeholder="Numri i telefonit"
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                name="email"
                placeholder="Email (opsionale)"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />

              <button type="submit" disabled={isSubmitting || state.items.length === 0}>
                {isSubmitting ? 'Dergim...' : 'Dergo porosine'}
              </button>
            </form>

            <aside className="pagesa-summary">
              <h2>Porosia</h2>
              {state.items.length === 0 ? (
                <p>Shporta eshte bosh.</p>
              ) : (
                <>
                  <div className="pagesa-items">
                    {state.items.map((item) => (
                      <div className="pagesa-item" key={item.id}>
                        <span>{item.name}</span>
                        <strong>{item.quantity} kg</strong>
                        <strong>{formatPrice(calculateItemBasePrice(item))}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="pagesa-total-row">
                    <span>Produkte</span>
                    <strong>{formatPrice(pricing.subtotal)}</strong>
                  </div>
                  <div className="pagesa-total-row">
                    <span>Posta</span>
                    <strong>{pricing.shipping === 0 ? 'Falas' : formatPrice(pricing.shipping)}</strong>
                  </div>
                  <div className="pagesa-total-row pagesa-grand-total">
                    <span>Totali</span>
                    <strong>{formatPrice(pricing.total)}</strong>
                  </div>
                </>
              )}
            </aside>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default PagesaPage;
