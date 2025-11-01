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

    // Constant speed in pixels/sec
    let PIXELS_PER_SECOND = 120; // default speed

    // Increase speed for devices narrower than 1090px
    if (containerWidth < 1090) PIXELS_PER_SECOND = 180;

    spans.forEach((span, index) => {
      const spanWidth = span.offsetWidth;
      const distance = containerWidth + spanWidth;

      // Duration for this span to fully scroll
      const duration = distance / PIXELS_PER_SECOND;

      // Delay start of next span so they don't overlap
      const delay = index === 0 ? 0 : spans
        .slice(0, index)
        .reduce((acc, prevSpan) => acc + (containerWidth + prevSpan.offsetWidth) / PIXELS_PER_SECOND, 0);

      span.style.animation = `scrollSingle ${duration}s linear ${delay}s infinite`;
      span.style.marginRight = `${containerWidth * 0.2}px`; // spacing between spans
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
