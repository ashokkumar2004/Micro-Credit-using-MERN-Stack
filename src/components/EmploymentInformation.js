import React from 'react';
import './LoanForm.css'; // Adjust the path based on the location of your CSS file

const EmploymentInformation = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <div>
      <h2>Employment Information</h2>
      <div>
        <label>
          Employment Duration:
          <select name="Employment_Duration" value={formData.Employment_Duration} onChange={handleChange}>
            <option value="">Select</option>
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="5 years">5 years</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Job Title:
          <input type="text" name="Job_Title" value={formData.Job_Title} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Bonuses & Allowances:
          <input type="number" name="Bonuses_Allowances" value={formData.Bonuses_Allowances} onChange={handleChange} />
        </label>
      </div>
      <button type="button" onClick={prevStep}>Previous</button>
      <button type="button" onClick={nextStep}>Next</button>
    </div>
  );
};

export default EmploymentInformation;
