import React from 'react';
import Ticker from 'react-ticker';

const Ribon = () => {
  const messages = [
    "*POSTA FALAS NË TË GJITHA POROSITË TUAJA NËSE KALOJNË VLERËN 29.99€ BRENDA 6 ORËVE*",
    "*QMIMI I POSTËS 2€*",
    "*PAS BLERJES, ZBRITEN -2€ NGA QMIMI TOTAL NË TË GJITHA POROSITË NËSE KALONI VLERËN 29.99€ BRENDA 6 ORËVE*"
  ];

  return (
    <div className="ribon-banner">
      <Ticker mode="smooth" speed={5}> {/* speed adjusts visually */}
        {() => (
          <div style={{ display: 'flex', gap: '200px', whiteSpace: 'nowrap' }}>
            {messages.map((msg, i) => <span key={i}>{msg}</span>)}
          </div>
        )}
      </Ticker>
    </div>
  );
};

export default Ribon;
