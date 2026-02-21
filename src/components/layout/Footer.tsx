import React from 'react';
import '../../styles/footer-style.css';

const Footer: React.FC = () => (
  <footer className="app-footer">
    <div className="footer-content">
      <span>&copy; {new Date().getFullYear()} Ticket Booking. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;