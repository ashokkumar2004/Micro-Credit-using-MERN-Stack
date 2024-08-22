// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure this path is correct

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Micro Credit</h1>
        <p>Your one-stop solution for managing and applying for loans efficiently.</p>
        <Link to="/signup" className="home-button">Create an Account</Link>
      </header>
      <section id="explore" className="home-explore">
        <div className="explore-content">
          <h2>A New Way to Manage Your Finances</h2>
          <p>
            Micro Credit is a comprehensive tool designed to help you manage your finances effectively. It provides a structured approach to guide you through each step of your financial journey.
          </p>
          <Link to="/" className="explore-button">Get Started</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
