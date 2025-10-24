import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-box">
        <div className="contact-left">
          <h1>Contact Natural Nuts</h1>
          <p className="subtitle">Have questions about our products or upcoming payment options?</p>
          <p className="description">
            We’re preparing to support secure credit card and PayPal payments soon. For now, reach out with any questions!
          </p>
          <div className="info-details">
  <p><strong>Email:</strong> support@nutswe.com</p>
  <p><strong>Phone:</strong> +383 44 123 456</p>
  <p><strong>Location:</strong> Ferizaj, Kosovo</p>
  
  {/* Embedded Google Map */}
  <div className="map-container">
    <iframe
      title="Ferizaj Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2945.212108464292!2d21.15887011539789!3d42.3703171791859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549e89ef30e259%3A0xe19ed02a3a41b360!2sFerizaj!5e0!3m2!1sen!2s!4v1629655371556!5m2!1sen!2s"
      width="100%"
      height="250"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
