import React from 'react';
import '../../styles/header-style.css';

const Header: React.FC = () => (
  <header className="app-header">
    <div className="header-content">
      <h1>Ticket Booking</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/reservation">Reserve</a>
        <a href="/view-reservation">My Reservations</a>
      </nav>
    </div>
  </header>
);

export default Header;