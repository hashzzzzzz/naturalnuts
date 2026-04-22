import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import logo from '../assets/123.png';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { state, removeFromCart, clearCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 1090);
  const searchInputRef = useRef(null);
  const cartRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchVisible((prev) => !prev);

  const handleCheckoutClick = () => {
    setCartOpen(false);
    setMenuOpen(false);
    navigate('/checkout');
  };

  const handleCartClick = () => {
    if (isDesktop) {
      setCartOpen((prev) => !prev);
      return;
    }

    handleCheckoutClick();
  };

  const handleLinkClick = (id, e) => {
    if (e) e.currentTarget.blur(); // remove focus to hide cursor

    if (id === 'contact') {
      navigate('/contactus');
      setMenuOpen(false);
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
    if (e) e.currentTarget.blur(); // remove focus
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
    setCartOpen(false);
  };

  // Live search on every key press
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (onSearch) onSearch(value);

    // automatically go to Products section on keyup
    handleLinkClick('product-list');
  };

  // Optional submit button (for aesthetics)
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
    const handleResize = () => {
      const desktop = window.innerWidth > 1090;
      setIsDesktop(desktop);
      if (!desktop) setCartOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
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

  const mobileCartButton = (
    <button
      type="button"
      className="cart-button mobile-cart-button"
      onClick={handleCheckoutClick}
      aria-label="Hap shportën"
    >
      <FaShoppingCart />
      {state.itemCount > 0 && <span className="cart-count">{state.itemCount}</span>}
    </button>
  );

  const desktopCartControl = (
    <div className="cart-wrapper" ref={cartRef}>
      <button
        type="button"
        className="cart-button"
        onClick={handleCartClick}
        aria-label="Hap shportën"
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
                Pastro shportën
              </button>
            )}
          </div>

          {state.items.length === 0 ? (
            <p className="cart-empty">Shporta është bosh</p>
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
              <button type="button" className="cart-checkout" onClick={handleCheckoutClick}>
                Vazhdo te pagesa
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
        {/* LOGO */}
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" />
        </div>

        <div className="mobile-nav-actions">
          {mobileCartButton}
          {/* HAMBURGER */}
          <div className="hamburger" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {/* SEARCH */}
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
                onChange={handleInputChange} // live search
                ref={searchInputRef}
              />
              <button type="submit">Kerko</button>
            </form>
          </li>

          {/* MAIN LINKS */}
          <li tabIndex={-1} onClick={handleLogoClick}>Ballina</li>
          <li tabIndex={-1} onClick={(e) => handleLinkClick('product-list', e)}>Produktet</li>
          <li tabIndex={-1} onClick={(e) => handleLinkClick('contact', e)}>Kontakti</li>
          <li>
            <button onClick={(e) => handleLinkClick('purchase-guide', e)} className="button">
              Blej Tash
            </button>
          </li>
          <li>
            {desktopCartControl}
          </li>

          {menuOpen && <li className="mobile-search"></li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
