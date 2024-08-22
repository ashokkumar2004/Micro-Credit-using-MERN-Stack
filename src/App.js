// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import LoanForm from './components/LoanForm'; // Import the LoanForm component
import Home from './components/Home'; // Import the Home component
import Navbar from './components/Navbar'; // Import the Navbar component
import ResultPage from './ResultPage';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/loan-form" element={<LoanForm />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown paths to home */}
      </Routes>
    </>
  );
}

export default App;