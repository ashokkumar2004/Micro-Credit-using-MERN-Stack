import React from 'react';

const FinancialInformation = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <div className="card">
      <h2>Financial Information</h2>
      <div>
        <label>
          Current Salary:
          <input type="number" name="Current_Salary" value={formData.Current_Salary} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Previous Salary:
          <input type="number" name="Previous_Salary" value={formData.Previous_Salary} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Owns House:
          <select name="Owns_House" value={formData.Owns_House} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Rent Amount:
          <input type="number" name="Rent_Amount" value={formData.Rent_Amount} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Grocery Expense:
          <input type="number" name="Grocery_Expense" value={formData.Grocery_Expense} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Current EMIs:
          <input type="number" name="Current_EMIs" value={formData.Current_EMIs} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Date of Previous Hike:
          <input type="date" name="Date_Previous_Hike" value={formData.Date_Previous_Hike} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Date of Next Hike:
          <input type="date" name="Date_Next_Hike" value={formData.Date_Next_Hike} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Bank Name:
          <input type="text" name="Bank_Name" value={formData.Bank_Name} onChange={handleChange} />
        </label>
      </div>
      <button type="button" className="prev" onClick={prevStep}>Previous</button>
      <button type="button" className="secondary" onClick={nextStep}>Next</button>
    </div>
  );
};

export default FinancialInformation;
