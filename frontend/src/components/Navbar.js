import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/123.png';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchVisible((prev) => !prev);

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
  };

  const handleLogoClick = (e) => {
    if (e) e.currentTarget.blur(); // remove focus
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
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
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* LOGO */}
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" />
        </div>

        {/* HAMBURGER */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
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
                placeholder="Search products..."
                value={searchInput}
                onChange={handleInputChange} // live search
                ref={searchInputRef}
              />
              <button type="submit">Submit</button>
            </form>
          </li>

          {/* MAIN LINKS */}
          <li onClick={handleLogoClick}>Ballina</li>
          <li onClick={(e) => handleLinkClick('product-list', e)}>Produktet</li>
          <li onClick={(e) => handleLinkClick('contact', e)}>Kontakti</li>
          <li>
            <button onClick={(e) => handleLinkClick('purchase-guide', e)} className="button">
              Blej Tash
            </button>
          </li>

          {menuOpen && <li className="mobile-search"></li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
