import React, { useState, useEffect } from "react";
import background from '../assets/vecteezy_abstract-elegant-dark-green-background-with-golden-line_13681217.jpg';
import nuts4 from '../assets/naturalnutsfoto5.jpg';
import nuts5 from '../assets/naturalnutsfoto6.jpg';
import nuts6 from '../assets/naturalnutsfoto7.jpg';
import nuts7 from '../assets/naturalnutsfoto8.jpg';
import back from '../assets/vecteezy_abstract-3d-gold-curved-green-ribbon-on-dark-green_17617486.jpg';
import banner from '../assets/vecteezy_green-marble-pattern-texture-with-empty-space-background-for_21433866.jpg';
import './Main.css';
import './Navbar.css'

const Main = () => {
  const [backgroundImage, setBackgroundImage] = useState(banner);

  useEffect(() => {
    const slideshowImages = [background, back, banner];
    let currentImageIndex = 0;
    let intervalId;

    const preloadAndSetImage = (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setBackgroundImage(src);
    };

    const timeoutId = setTimeout(() => {
      preloadAndSetImage(slideshowImages[currentImageIndex]);

      intervalId = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
        preloadAndSetImage(slideshowImages[currentImageIndex]);
      }, 4000);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  // ✅ Add this function to scroll to section
  const handleLinkClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="main-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "#013220", // Fixed typo: ## → #
        transition: "background-image 1.2s ease-in-out",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="main-grid">
        <div className="image-side">
          <div className="image-grid">
            <img src={nuts4} alt="Nuts 1" className="grid-img" />
            <img src={nuts5} alt="Nuts 2" className="grid-img" />
            <img src={nuts6} alt="Nuts 3" className="grid-img" />
            <img src={nuts7} alt="Nuts 4" className="grid-img" />
          </div>
        </div>

        <div className="text-side">
          <h1>Natural Nuts</h1>
          <p>
            Natural Nuts ofron fruta të thata natyrale me cilësi
            të lartë. Ne importojmë produktet tona kryesisht nga Greqia dhe i sjellim në tregun vendas
            për konsum të shëndetshëm dhe të sigurt.
          </p>
          <ul>
        <li>
  <button
    type="button"
    onClick={() => handleLinkClick('purchase-guide')}
    className="button"
  >
    Si të blejmë produktet
  </button>
</li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Main;
