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

    // **Set constant speed in pixels per second**
    const PIXELS_PER_SECOND = 100; // change this to make it faster/slower

    // Calculate duration based on total distance
    const distance = textWidth + containerWidth;
    const duration = distance / PIXELS_PER_SECOND;

    // Apply animation dynamically
    textRef.current.style.animation = `scrollText ${duration}s linear infinite`;

    // Adjust spacing between spans dynamically based on container width
    const spanMargin = Math.max(containerWidth * 0.1, 150); // 10% of screen width or minimum 150px
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
