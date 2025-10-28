import React from 'react';
import './Footer.css';
import logo from '../assets/naturalnutslogofin.png';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (id) => {
    if (id === 'contact') {
      navigate('/contactus');
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
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Links first */}
        <div className="footer-section links">
          <h2>Linqe të Shpejta</h2>
          <ul>
            <li onClick={handleLogoClick} style={{ cursor: 'pointer' }}>Ballina</li>
            <li onClick={() => handleLinkClick('contact')} style={{ cursor: 'pointer' }}>Rreth Nesh</li>
            <li onClick={() => handleLinkClick('product-list')} style={{ cursor: 'pointer' }}>Produktet</li>
            <li onClick={() => handleLinkClick('contact')} style={{ cursor: 'pointer' }}>Kontakti</li>
          </ul>
        </div>

        {/* Logo second */}
        <div className="footer-section logo-footer" id="footer-logo">
          <img
            src={logo}
            alt="Natural Nuts Logo"
            className="footer-logo"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Contact third */}
        <div className="footer-section contact">
          <h2 className='cont'>Kontakti</h2>
          <p>Ferizaj, Kosovë</p>
          <p>naturalnuts_ks@proton.me</p>
          <p>Rrjetet Sociale</p>
          <p className="social-icons">
            <a href="https://www.facebook.com/people/Natural-Nuts/61568125697424/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>{' '}
            <a href="https://instagram.com/naturalnuts_ks" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>{' '}
            <a href="https://www.tiktok.com/@naturalnuts_ks1" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Natural Nuts | Të gjitha të drejtat e rezervuara</p>
      </div>
    </footer>
  );
};

export default Footer;
