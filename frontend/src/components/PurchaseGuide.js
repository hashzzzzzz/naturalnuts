import React, { useState, useEffect } from 'react';
import './PurchaseGuide.css';

const originalSteps = [
  { title: 'Hapi 1', text: 'Zgjidh produktin që dëshiron nga faqja kryesore.', icon: '🛍️' },
  { title: 'Hapi 2', text: 'Kliko butonin "Porosite" për të vazhduar me blerjen.', icon: '🖱️' },
  { title: 'Hapi 3', text: 'Plotëso formularin me emrin, adresën dhe numrin e telefonit.', icon: '📝' },
  { title: 'Hapi 6', text: 'Pagesa bëhet cash në momentin që merr produktin.', icon: '💵' },
  { title: 'Hapi 5', text: 'Do të kontaktojmë përmes telefonit për të konfirmuar porosinë.', icon: '📞' },
  { title: 'Hapi 4', text: 'Konfirmo të dhënat dhe dërgo porosinë.', icon: '✅' },
];

const reorderForMobile = () => {
  const reordered = [...originalSteps];
  // Swap index 3 and 5 (4th and 6th element)
  [reordered[3], reordered[5]] = [reordered[5], reordered[3]];
  return reordered;
};

const PurchaseGuide = () => {
  const [steps, setSteps] = useState(
    window.innerWidth <= 1277 ? reorderForMobile() : originalSteps
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1277) {
        setSteps(reorderForMobile());
      } else {
        setSteps(originalSteps);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = window.innerWidth <= 1277;

  return (
    <div style={{ backgroundColor: '#d8f3dc', width: '100%' }}>
      <div className="guide-container">
        <h1 className="guide-title">BLERJA E PRODUKTEVE</h1>

        <div className="step-grid">
          {steps.map((step, index) => (
            <div className="step-wrapper" key={index}>
              <div className="step-glow">
                <div className="step-circle">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-content">
                    <h2>{step.title}</h2>
                    <p>{step.text}</p>
                  </div>
                </div>

                {/* ARROW rendering logic */}
  {(index !== steps.length - 1) && (
  <div className={`${isMobile ? 'arrow arrow-down' : (index === 2 || index === 5 ? 'arrow arrow-down' : (index === 3 || index === 4 ? 'arrow arrow-custom' : 'arrow'))}`} />
)}

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseGuide;
