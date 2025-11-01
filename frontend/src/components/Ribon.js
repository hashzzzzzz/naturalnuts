import React, { useEffect, useRef, useState } from 'react';
import './Ribon.css';

const Ribon = () => {
  const ribbonRef = useRef(null);
  const textRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimate(true);
      },
      { threshold: 0.5 }
    );

    if (ribbonRef.current) observer.observe(ribbonRef.current);
    return () => {
      if (ribbonRef.current) observer.unobserve(ribbonRef.current);
    };
  }, []);

  useEffect(() => {
    if (!animate || !textRef.current || !ribbonRef.current) return;

    const containerWidth = ribbonRef.current.offsetWidth;
    const textWidth = textRef.current.scrollWidth;

    // Adjust speed: pixels per second
    let PIXELS_PER_SECOND = containerWidth < 1090 ? 180 : 100;

    // Total duration = distance / speed
    const duration = (textWidth + containerWidth) / PIXELS_PER_SECOND;

    textRef.current.style.animation = `scrollSingle ${duration}s linear infinite`;
  }, [animate]);

  return (
    <div className="ribon-banner" ref={ribbonRef}>
      <div className={`ribon-text ${animate ? 'animate' : ''}`} ref={textRef}>
        <span>
          *POSTA FALAS NË TË GJITHA POROSITË TUAJA NËSE KALOJNË VLERËN 29.99€ BRENDA 6 ORËVE* 
          *QMIMI I POSTËS 2€* 
          *PAS BLERJES, ZBRITEN -2€ NGA QMIMI TOTAL NË TË GJITHA POROSITË NËSE KALONI VLERËN 29.99€ BRENDA 6 ORËVE*
        </span>
      </div>
    </div>
  );
};

export default Ribon;
