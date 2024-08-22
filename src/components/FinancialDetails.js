import React from 'react';
import './LoanForm.css'; // Adjust the path based on the location of your CSS file

const FinancialDetails = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <div>
      <h2>Financial Details</h2>
      <div>
        <label>
          Savings:
          <input type="number" name="Savings" value={formData.Savings} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Investments:
          <input type="number" name="Investments" value={formData.Investments} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Monthly Expenses:
          <input type="number" name="Monthly_Expenses" value={formData.Monthly_Expenses} onChange={handleChange} />
        </label>
      </div>
      <button type="button" onClick={prevStep}>Previous</button>
      <button type="button" onClick={nextStep}>Next</button>
    </div>
  );
};

export default FinancialDetails;
