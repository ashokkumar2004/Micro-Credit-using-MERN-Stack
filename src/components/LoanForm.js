  import React, { useState } from 'react';
  import axios from 'axios';
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import './LoanForm.css'; // Ensure this path is correct
  import { useNavigate } from 'react-router-dom'; // Updated import

  const LoanForm = () => {
    // Inputs
    const [formData, setFormData] = useState({
      Full_Name: '',
      Address: '',
      PAN_Number: '',
      Company_Name: '',
      Current_Salary: '',
      Previous_Salary: '',
      Owns_House: '',
      Rent_Amount: '',
      Grocery_Expense: '',
      Current_EMIs: '',
      Date_Previous_Hike: '',
      Date_Next_Hike: '',
      Bank_Name: '',
      Credit_Score: '',
      Number_of_Credit_Cards: '',
      Total_Credit_Limit: '',
      Number_of_Loans: '',
      Employment_Duration: '',
      Job_Title: '',
      Bonuses_Allowances: '',
      Savings: '',
      Investments: '',
      Monthly_Expenses: '',
      Age: '',
      Education_Level: '',
      Marital_Status: '',
      Dependents: '',
      Loan_Purpose: '',
      Mall_Visits_Per_Month: '',
      Mall_Spend_Average: '',
      Loan1_EMI: '0',
      Loan1_Tenure: '0',
      Loan2_EMI: '0',
      Loan2_Tenure: '0',
      Loan3_EMI: '0',
      Loan3_Tenure: '0'
    });
  // List of Banks
    const bankOptions = [
      'State Bank of India',
      'HDFC Bank',
      'ICICI Bank',
      'Punjab National Bank',
      'Axis Bank',
      'Kotak Mahindra Bank',
      'Bank of Baroda',
      'Union Bank of India',
      'IndusInd Bank',
      'Canara Bank',
      'IDFC First Bank',
      'Bank of India',
      'Central Bank of India',
      'Yes Bank',
      'Federal Bank',
      'UCO Bank',
      'IDBI Bank',
      'Indian Overseas Bank',
      'Indian Bank',
      'RBL Bank',
      'Karur Vysa Bank',
      'others'
    ];
  // List of Jobs 
    const jobTitleOptions = [
      'Software Engineer',
      'Data Analyst',
      'Product Manager',
      'Project Manager',
      'Data Scientist',
      'Business Analyst',
      'DevOps Engineer',
      'System Administrator',
      'UX/UI Designer',
      'Marketing Manager',
      'Sales Executive',
      'Human Resources Manager',
      'Finance Manager',
      'Operations Manager',
      'Technical Support Engineer',
      'Network Engineer',
      'Quality Assurance Engineer',
      'Full Stack Developer',
      'Mobile Developer',
      'Machine Learning Engineer',
      'others'
    ];

    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
    
      // Function to validate if the value is non-negative or empty
      const validateNonNegative = (val) => {
        const numericValue = parseFloat(val);
        return !isNaN(numericValue) && numericValue >= 0 ? val : '';
      };
    
      setFormData(prevFormData => {
        // Clear Rent_Amount if Owns_House is updated to "Yes"
        if (name === 'Owns_House' && value === 'Yes') {
          return {
            ...prevFormData,
            [name]: value,
            Rent_Amount: '0' // Clear Rent_Amount when Owns_House is "Yes"
          };
        }
    
        // Apply non-negative validation to numeric fields
        const validatedValue = (name === 'Number_of_Loans' || name.includes('EMI') || name.includes('Tenure'))
          ? validateNonNegative(value)
          : value;
    
        return {
          ...prevFormData,
          [name]: validatedValue
        };
      });
    };
    
  
    const validateForm = () => {
      // Enhanced validation with specific error messages
      const errors = [];
      for (const key in formData) {
        if (formData[key].trim() === '') {
          errors.push(key);
        }
      }
      if (errors.length > 0) {
        return `Please fill out the following fields: ${errors.join(', ')}`;
      }
      return '';
    };
  // POST method is applied and pass to /predict route after clicking Submit button.
    const handleSubmit = async (e) => {
      e.preventDefault();
      const { Number_of_Loans, Loan2_EMI, Loan2_Tenure, Loan3_EMI, Loan3_Tenure } = formData;
      const numLoans = parseInt(Number_of_Loans, 10);
      // Validate conditional fields
      if (numLoans >= 2 && (Loan2_EMI === '' || Loan2_Tenure === '')) {
        toast.error('Please fill in Loan 2 EMI and Tenure');
        return;
      }
      if (numLoans >= 3 && (Loan3_EMI === '' || Loan3_Tenure === '')) {
        toast.error('Please fill in Loan 3 EMI and Tenure');
        return;
      }
  
      // e.preventDefault();
      const validationError = validateForm();
      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', formData);
        const data = response.data;
        console.log('Prediction Results:', response.data);
        toast.success('Loan application submitted successfully!');
        navigate('/result', { state: { resultData: data } });
      } catch (error) {
        console.error('Error making prediction:', error.response ? error.response.data : error.message);
        toast.error('An error occurred while submitting the application.');
      }
    };
  // Forms to be seen in the frontend
  const numberOfLoans = formData.Number_of_Loans;
  const loanAmount = formData.Loan_Amount; // Assuming you have this in formData
    return (
      <form onSubmit={handleSubmit} className="form-all">
        <ToastContainer />
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Full Name
                <input
                  type="text"
                  name="Full_Name"
                  value={formData.Full_Name}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Address
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                PAN Number
                <input
                  type="text"
                  name="PAN_Number"
                  value={formData.PAN_Number}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Age
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Education Level
                <select
                  name="Education_Level"
                  value={formData.Education_Level}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="">Select</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PostGraduate">PostGraduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Marital Status
                <select
                  name="Marital_Status"
                  value={formData.Marital_Status}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Dependents
                <input
                  type="number"
                  name="Dependents"
                  value={formData.Dependents}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Loan Purpose
                <select
                  name="Loan_Purpose"
                  value={formData.Loan_Purpose}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="">Select</option>
                  <option value="Home Improvement">Home Improvement</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="form-section">
          <h2>Financial Information</h2>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Current Salary
                <input
                  type="number"
                  name="Current_Salary"
                  value={formData.Current_Salary}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Previous Salary
                <input
                  type="number"
                  name="Previous_Salary"
                  value={formData.Previous_Salary}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                  Savings
                <input
                  type="number"
                  name="Savings"
                  value={formData.Savings}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                  Investments
                <input
                  type="number"
                  name="Investments"
                  value={formData.Investments}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                 Monthly_Expenses
                <input
                  type="number"
                  name="Monthly_Expenses"
                  value={formData.Monthly_Expenses}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Owns House
                <select
                  name="Owns_House"
                  value={formData.Owns_House}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
            </div>
            <div className="form-line">
              {formData.Owns_House === 'No' && (
                <label className="form-label">
                  Rent Amount
                  <input
                    type="number"
                    name="Rent_Amount"
                    value={formData.Rent_Amount}
                    onChange={handleChange}
                    min="0"
                    className="form-textbox"
                  />
                </label>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Grocery Expense
                <input
                  type="number"
                  name="Grocery_Expense"
                  value={formData.Grocery_Expense}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Current EMIs
                <input
                  type="number"
                  name="Current_EMIs"
                  value={formData.Current_EMIs}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Date of Previous Hike
                <input
                  type="date"
                  name="Date_Previous_Hike"
                  value={formData.Date_Previous_Hike}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Date of Next Hike
                <input
                  type="date"
                  name="Date_Next_Hike"
                  value={formData.Date_Next_Hike}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="form-section">
          <h2>Employment Information</h2>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Company Name
                <input
                  type="text"
                  name="Company_Name"
                  value={formData.Company_Name}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Job Title
                <select
                  name="Job_Title"
                  value={formData.Job_Title}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="">Select</option>
                  {jobTitleOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Employment Duration (Years)
                <input
                  type="number"
                  name="Employment_Duration"
                  value={formData.Employment_Duration}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Bonuses & Allowances
                <input
                  type="number"
                  name="Bonuses_Allowances"
                  value={formData.Bonuses_Allowances}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
         
      <div className='form-section'>
      <h2>Loan Information</h2>
      <div className='form-row'>
        <div className="form-line">
          <label className="form-label">
            Number of Loans
            <input
              type="number"
              name="Number_of_Loans"
              value={formData.Number_of_Loans}
              onChange={handleChange}
              className="form-textbox"
            />
          </label>
        </div>
      </div>

      {numberOfLoans >= 1 && (
        <div className="form-line">
          <h3>Loan 1 Details</h3>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Loan 1 EMI
                <input
                  type="number"
                  name="Loan1_EMI"
                  value={formData.Loan1_EMI}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Loan 1 Tenure
                <input
                  type="number"
                  name="Loan1_Tenure"
                  value={formData.Loan1_Tenure}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {numberOfLoans >= 2 && loanAmount !== 11 && (
        <div className="form-line">
          <h3>Loan 2 Details</h3>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Loan 2 EMI
                <input
                  type="number"
                  name="Loan2_EMI"
                  value={formData.Loan2_EMI}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Loan 2 Tenure
                <input
                  type="number"
                  name="Loan2_Tenure"
                  value={formData.Loan2_Tenure}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {numberOfLoans >= 3 && loanAmount !== 11 && (
        <div className="form-line">
          <h3>Loan 3 Details</h3>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Loan 3 EMI
                <input
                  type="number"
                  name="Loan3_EMI"
                  value={formData.Loan3_EMI}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Loan 3 Tenure
                <input
                  type="number"
                  name="Loan3_Tenure"
                  value={formData.Loan3_Tenure}
                  onChange={handleChange}
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
        </div>
      )}
  </div>
  </div>

        {/* Mall Details Section */}
        <div className="form-section">
          <h2>Mall Details</h2>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Mall Visits Per Month
                <input
                  type="number"
                  name="Mall_Visits_Per_Month"
                  value={formData.Mall_Visits_Per_Month}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Average Mall Spend
                <input
                  type="number"
                  name="Mall_Spend_Average"
                  value={formData.Mall_Spend_Average}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Loan Details Section
        <div className="form-section">
          <h2>Loan Details</h2>
          {[1, 2, 3].map((loanNumber) => (
            <div className="form-row" key={loanNumber}>
              <div className="form-line">
                <label className="form-label">
                  Loan {loanNumber} EMI
                  <input
                    type="number"
                    name={`Loan_${loanNumber}_EMI`}
                    value={formData[`Loan_${loanNumber}_EMI`]}
                    onChange={handleChange}
                    min="0"
                    className="form-textbox"
                  />
                </label>
              </div>
              <div className="form-line">
                <label className="form-label">
                  Loan {loanNumber} Tenure
                  <input
                    type="number"
                    name={`Loan_${loanNumber}_Tenure`}
                    value={formData[`Loan_${loanNumber}_Tenure`]}
                    onChange={handleChange}
                    min="0"
                    className="form-textbox"
                  />
                </label>
              </div>
            </div>
          ))}
        </div> */}

        {/* Bank and Credit Information Section */}
        <div className="form-section">
          <h2>Bank and Credit Information</h2>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Bank Name
                <select
                  name="Bank_Name"
                  value={formData.Bank_Name}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="">Select</option>
                  {bankOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Credit Score
                <input
                  type="number"
                  name="Credit_Score"
                  value={formData.Credit_Score}
                  onChange={handleChange}
                  min="0"
                  max="850"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-line">
              <label className="form-label">
                Number of Credit Cards
                <input
                  type="number"
                  name="Number_of_Credit_Cards"
                  value={formData.Number_of_Credit_Cards}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
            <div className="form-line">
              <label className="form-label">
                Total Credit Limit
                <input
                  type="number"
                  name="Total_Credit_Limit"
                  value={formData.Total_Credit_Limit}
                  onChange={handleChange}
                  min="0"
                  className="form-textbox"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-row">
          <button type="submit" className="form-button">Submit</button>
        </div>
      </form>
    );
  };

  export default LoanForm;



