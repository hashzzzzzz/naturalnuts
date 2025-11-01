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

    const textWidth = textRef.current.scrollWidth;
    const containerWidth = ribbonRef.current.offsetWidth;

    // Adjust speed dynamically based on container width
    let speed = 100; // pixels per second default
    if (containerWidth < 700) speed = 70; // slower speed on narrow screens

    const duration = (textWidth + containerWidth) / speed;
    textRef.current.style.animation = `scrollText ${duration}s linear infinite`;

    // Adjust spacing between spans dynamically
    const spanMargin = containerWidth < 700 ? 120 : 200;
    Array.from(textRef.current.children).forEach(span => {
      span.style.marginRight = `${spanMargin}px`;
    });
  }, [animate]);

  return (
    <div className="ribon-banner" ref={ribbonRef}>
      <div className={`ribon-text ${animate ? 'animate' : ''}`} ref={textRef}>
        <span>*POSTA FALAS NË TË GJITHA POROSITË TUAJA NËSE KALOJNË VLERËN 29.99€ BRENDA 6 ORËVE*</span>
        <span>*QMIMI I POSTËS 2€*</span>
        <span>*PAS BLERJES, ZBRITEN -2€ NGA QMIMI TOTAL NË TË GJITHA POROSITË NËSE KALONI VLERËN 29.99€ BRENDA 6 ORËVE*</span>
      </div>
    </div>
  );
};

export default Ribon;
