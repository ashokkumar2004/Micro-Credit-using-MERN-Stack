import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Ensure this path is correct

const Navbar = () => {
  const location = useLocation(); // Get the current location
  const isHomePage = location.pathname === '/';

  return (
    <nav className={`navbar ${isHomePage ? 'navbar-home' : ''}`}>
      <div className="navbar-brand">
        <h1>Micro Credit</h1>
      </div>
      <div className="navbar-links">
        {location.pathname !== '/' && (
          <Link to="/" className="navbar-link">Explore</Link>
        )}
        {location.pathname !== '/signup' && (
          <Link to="/signup" className="navbar-link">Sign Up</Link>
        )}
        {location.pathname !== '/login' && (
          <Link to="/login" className="navbar-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
