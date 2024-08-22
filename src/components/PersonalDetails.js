import React from 'react';
import './LoanForm.css'; // Adjust the path based on the location of your CSS file

const PersonalDetails = ({ formData, handleChange, prevStep, handleSubmit }) => {
  return (
    <div>
      <h2>Personal Details</h2>
      <div>
        <label>
          Age:
          <input type="number" name="Age" value={formData.Age} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Education Level:
          <input type="text" name="Education_Level" value={formData.Education_Level} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Marital Status:
          <select name="Marital_Status" value={formData.Marital_Status} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Dependents:
          <input type="number" name="Dependents" value={formData.Dependents} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Loan Purpose:
          <select name="Loan_Purpose" value={formData.Loan_Purpose} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Home Improvement">Home Improvement</option>
            <option value="Education">Education</option>
            <option value="Medical">Medical</option>
            <option value="Personal">Personal</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Mall Visits Per Month:
          <input type="number" name="Mall_Visits_Per_Month" value={formData.Mall_Visits_Per_Month} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Mall Spend Average:
          <input type="number" name="Mall_Spend_Average" value={formData.Mall_Spend_Average} onChange={handleChange} />
        </label>
      </div>
      <button type="button" onClick={prevStep}>Previous</button>
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PersonalDetails;
