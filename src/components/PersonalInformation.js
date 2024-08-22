import React from 'react';
import './LoanForm.css'; // Adjust the path based on the location of your CSS file

const PersonalInformation = ({ formData, handleChange, nextStep }) => {
  return (
    <div>
      <h2>Personal Information</h2>
      <div>
        <label>
          Full Name:
          <input type="text" name="Full_Name" value={formData.Full_Name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Address:
          <input type="text" name="Address" value={formData.Address} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          PAN Number:
          <input type="text" name="PAN_Number" value={formData.PAN_Number} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Company Name:
          <input type="text" name="Company_Name" value={formData.Company_Name} onChange={handleChange} />
        </label>
      </div>
      <button type="button" onClick={nextStep}>Next</button>
    </div>
  );
};

export default PersonalInformation;
