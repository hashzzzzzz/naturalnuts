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
    const spans = Array.from(textRef.current.children);

    // Speed in pixels/sec
    let PIXELS_PER_SECOND = containerWidth < 1090 ? 180 : 120;

    let totalDelay = 0;

    spans.forEach((span, index) => {
      const spanWidth = span.offsetWidth;
      const distance = containerWidth + spanWidth;

      const duration = distance / PIXELS_PER_SECOND;

      // Each span starts after the previous span finishes
      span.style.animation = `scrollSingle ${duration}s linear ${totalDelay}s forwards`;

      // Update totalDelay for next span
      totalDelay += duration;

      // Optional spacing between spans visually
      span.style.marginRight = `${containerWidth * 0.2}px`;
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
