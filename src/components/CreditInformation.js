import React from 'react';
import './LoanForm.css'; // Adjust the path based on the location of your CSS file


const CreditInformation = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <div>
      <h2>Credit Information</h2>
      <div>
        <label>
          Credit Score:
          <input type="number" name="Credit_Score" value={formData.Credit_Score} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Number of Credit Cards:
          <input type="number" name="Number_of_Credit_Cards" value={formData.Number_of_Credit_Cards} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Total Credit Limit:
          <input type="number" name="Total_Credit_Limit" value={formData.Total_Credit_Limit} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Number of Loans:
          <input type="number" name="Number_of_Loans" value={formData.Number_of_Loans} onChange={handleChange} />
        </label>
      </div>
      <button type="button" onClick={prevStep}>Previous</button>
      <button type="button" onClick={nextStep}>Next</button>
    </div>
  );
};

export default CreditInformation;
