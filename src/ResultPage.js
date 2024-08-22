// src/components/Result.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.resultData;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  if (loading) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2 className="result-title">Loading results...</h2>
        </div>
      </div>
    );
  }

  // if there is no results are fetched then it should be return this statement
  if (!resultData) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2 className="result-title">No results to display</h2>
          <button className="result-button" onClick={() => navigate('/')}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // results
  return (
    <div className="result-container">
      <div className="result-card">
        <h2 className="result-title">Loan Application Result</h2>
        <p className="result-details">
          Eligibility: {resultData.Eligibility ? 'Eligible' : 'Not Eligible'}
        </p>
        {!resultData.Eligibility ? (
          <p className="result-condolence">
            We're sorry, but your application did not meet the eligibility criteria. Please review your details or contact support for further assistance.
          </p>
        ) : (
          <>
            {/* <p className="result-details">Requested Loan Amount Predicted: {resultData.Requested_Loan_Amount_Predicted}</p> */}
            <p className="result-details">Requested Loan Amount Actual: {resultData.Requested_Loan_Amount_Actual}</p>
            <p className="result-details">Preferred Repayment Period: {resultData.Preferred_Repayment_Period} months</p>
            <p className="result-details">EMI Predicted: {resultData.EMI_Predicted}</p>
            <p className="result-details">Risk Score: {resultData.Risk_Score}</p>
            
          </>
        )}
        <button className="result-button" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Result;
