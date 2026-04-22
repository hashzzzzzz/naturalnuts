import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { calculateCartPricing, calculateItemBasePrice, formatPrice } from '../cartPricing';
import logo from '../assets/123.png';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { state, removeFromCart, clearCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const pricing = calculateCartPricing(state.items);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchVisible((prev) => !prev);

  const handleCheckoutClick = () => {
    setCartOpen(false);
    setMenuOpen(false);
    navigate('/pagesa');
  };

  const handleCartClick = () => {
    setCartOpen((prev) => !prev);
  };

  const handleLinkClick = (id, e) => {
    if (e) e.currentTarget.blur();

    if (id === 'contact') {
      navigate('/contactus');
      setMenuOpen(false);
      setCartOpen(false);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }

    setMenuOpen(false);
    setCartOpen(false);
  };

  const handleLogoClick = (e) => {
    if (e) e.currentTarget.blur();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
    setCartOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (onSearch) onSearch(value);

    handleLinkClick('product-list');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchInput);
    setSearchVisible(false);
  };

  useEffect(() => {
    if (window.innerWidth >= 1080) {
      const timer = setTimeout(() => setSearchVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest('.cart-wrapper')) {
        setCartOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setCartOpen(false);
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  const renderCartControl = (className = '') => (
    <div className={`cart-wrapper ${className}`}>
      <button
        type="button"
        className="cart-button"
        onClick={handleCartClick}
        aria-label="Hap shporten"
        aria-expanded={cartOpen}
      >
        <FaShoppingCart />
        {state.itemCount > 0 && <span className="cart-count">{state.itemCount}</span>}
      </button>

      {cartOpen && (
        <div className="cart-dropdown">
          <div className="cart-dropdown-header">
            <h3>Shporta</h3>
            {state.itemCount > 0 && (
              <button type="button" onClick={clearCart}>
                Pastro shporten
              </button>
            )}
          </div>

          {state.items.length === 0 ? (
            <p className="cart-empty">Shporta eshte bosh</p>
          ) : (
            <>
              <div className="cart-dropdown-items">
                {state.items.map((item) => (
                  <div className="cart-dropdown-item" key={item.id}>
                    <div className="cart-dropdown-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                      ) : (
                        <span>{item.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="cart-dropdown-info">
                      <strong>{item.name}</strong>
                      <span>{item.quantity} kg</span>
                      <span>{formatPrice(calculateItemBasePrice(item))}</span>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Fshij
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-dropdown-totals">
                <div>
                  <span>Produkte</span>
                  <strong>{formatPrice(pricing.subtotal)}</strong>
                </div>
                <div>
                  <span>Posta</span>
                  <strong>{pricing.shipping === 0 ? 'Falas' : formatPrice(pricing.shipping)}</strong>
                </div>
                <div>
                  <span>Totali</span>
                  <strong>{formatPrice(pricing.total)}</strong>
                </div>
              </div>

              <button type="button" className="cart-checkout" onClick={handleCheckoutClick}>
                Vazhdo porosine
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" />
        </div>

        <div className="mobile-nav-actions">
          {renderCartControl('mobile-cart-wrapper')}
          <div className="hamburger" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li className="search-container">
            <button id="init-button" onClick={toggleSearch} className="search-icon">
              <i className="fas fa-magnifying-glass"></i>
            </button>
            <form
              onSubmit={handleSearchSubmit}
              className={`search-form ${searchVisible ? 'visible' : ''}`}
            >
              <input
                type="text"
                placeholder="Kerko produkte..."
                value={searchInput}
                onChange={handleInputChange}
                ref={searchInputRef}
              />
              <button type="submit">Kerko</button>
            </form>
          </li>

          <li tabIndex={-1} onClick={handleLogoClick}>Ballina</li>
          <li tabIndex={-1} onClick={(e) => handleLinkClick('product-list', e)}>Produktet</li>
          <li tabIndex={-1} onClick={(e) => handleLinkClick('contact', e)}>Kontakti</li>
          <li>
            <button onClick={(e) => handleLinkClick('purchase-guide', e)} className="button">
              Blej Tash
            </button>
          </li>
          <li>
            {renderCartControl('desktop-cart-wrapper')}
          </li>

          {menuOpen && <li className="mobile-search"></li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
