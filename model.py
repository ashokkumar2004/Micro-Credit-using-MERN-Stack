# # 
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import joblib
import numpy as np

# Load the dataset
# file_path = 'loan_approval_dataset_extended.csv'
# df = pd.read_csv(file_path)
# df = pd.read_csv("C:/Users/balaj/Desktop/react-login/src/loan_approval_dataset_extended (1).csv")
df = pd.read_csv("loan_approval_dataset_extended.csv")
# Clean up column names (strip leading/trailing spaces)
df.columns = df.columns.str.strip()

# Drop non-essential columns
drop_columns = ["Full_Name", "Address", "PAN_Number", "Company_Name", "Bank_Name", "Education_Level", "Job_Title"]
df = df.drop(columns=drop_columns)

# Handle categorical columns    
categorical_cols = ["Owns_House", "Marital_Status", "Dependents", "Loan_Purpose"]
df[categorical_cols] = df[categorical_cols].astype("category")

# Convert date columns to numerical features
df["Date_Previous_Hike"] = pd.to_datetime(df["Date_Previous_Hike"], errors='coerce')
df["Date_Next_Hike"] = pd.to_datetime(df["Date_Next_Hike"], errors='coerce')
df["Months_Since_Previous_Hike"] = (pd.Timestamp.now() - df["Date_Previous_Hike"]).dt.days / 30
df["Months_Until_Next_Hike"] = (df["Date_Next_Hike"] - pd.Timestamp.now()).dt.days / 30

# Drop original date columns
df = df.drop(columns=["Date_Previous_Hike", "Date_Next_Hike"])

# Handle logical inconsistencies in financial data
df = df[(df["Current_Salary"] >= df["Rent_Amount"]) & (df["Current_Salary"] >= df["Grocery_Expense"])]

# Separate features (X) and target (y)
# Separate features (X) and target (y)
X = df.drop(columns=["Eligible_Status", "Requested_Loan_Amount", "Preferred_Repayment_Period", "emi", "risk_score"])
y_eligibility = df["Eligible_Status"]
y_loan_amount = df["Requested_Loan_Amount"]
y_repayment_period = df["Preferred_Repayment_Period"]
y_emi = df["emi"]
y_risk_score = df["risk_score"]

# Define categorical columns
categorical_cols = ["Owns_House", "Marital_Status", "Loan_Purpose"]

# Column transformer for one-hot encoding and scaling
encoder = OneHotEncoder(drop="first", handle_unknown='ignore')
scaler = StandardScaler()
ct = ColumnTransformer(
    transformers=[
        ("encoder", encoder, categorical_cols),
        ("scaler", scaler, [col for col in X.columns if col not in categorical_cols])
    ],
    remainder="passthrough"
)

# Fit and transform the data
X = ct.fit_transform(X)

# Save the column transformer
joblib.dump(ct, "column_transformer.pkl")

# Split data into training and testing sets
X_train, X_test, y_train_eligibility, y_test_eligibility = train_test_split(X, y_eligibility, test_size=0.3, random_state=42)
X_train_loan, X_test_loan, y_train_loan_amount, y_test_loan_amount = train_test_split(X, y_loan_amount, test_size=0.3, random_state=42)
X_train_repayment, X_test_repayment, y_train_repayment_period, y_test_repayment_period = train_test_split(X, y_repayment_period, test_size=0.3, random_state=42)
X_train_emi, X_test_emi, y_train_emi, y_test_emi = train_test_split(X, y_emi, test_size=0.3, random_state=42)
X_train_risk, X_test_risk, y_train_risk_score, y_test_risk_score = train_test_split(X, y_risk_score, test_size=0.3, random_state=42)

# Initialize and train the models
rf_classifier_eligibility = RandomForestClassifier(n_estimators=100, random_state=42)
rf_classifier_eligibility.fit(X_train, y_train_eligibility)
y_pred_eligibility = rf_classifier_eligibility.predict(X_test)
accuracy_eligibility = accuracy_score(y_test_eligibility, y_pred_eligibility)
print(f"Accuracy (Loan Eligibility Prediction): {accuracy_eligibility}")

rf_regressor_loan_amount = RandomForestRegressor(n_estimators=100, random_state=42)
rf_regressor_loan_amount.fit(X_train_loan, y_train_loan_amount)
y_pred_loan_amount = rf_regressor_loan_amount.predict(X_test_loan)
mse_loan_amount = mean_squared_error(y_test_loan_amount, y_pred_loan_amount)
print(f"MSE (Loan Amount Prediction): {mse_loan_amount}")

rf_regressor_repayment_period = RandomForestRegressor(n_estimators=100, random_state=42)
rf_regressor_repayment_period.fit(X_train_repayment, y_train_repayment_period)
y_pred_repayment_period = rf_regressor_repayment_period.predict(X_test_repayment)
mse_repayment_period = mean_squared_error(y_test_repayment_period, y_pred_repayment_period)
print(f"MSE (Repayment Period Prediction): {mse_repayment_period}")

# rf_regressor_emi = RandomForestRegressor(n_estimators=100, random_state=42)
# rf_regressor_emi.fit(X_train_emi, y_train_emi)
# y_pred_emi = rf_regressor_emi.predict(X_test_emi)
# mse_emi = mean_squared_error(y_test_emi, y_pred_emi)
# print(f"MSE (EMI Prediction): {mse_emi}")

rf_regressor_risk_score = RandomForestRegressor(n_estimators=100, random_state=42)
rf_regressor_risk_score.fit(X_train_risk, y_train_risk_score)
y_pred_risk_score = rf_regressor_risk_score.predict(X_test_risk)
mse_risk_score = mean_squared_error(y_test_risk_score, y_pred_risk_score)
print(f"MSE (Risk Score Prediction): {mse_risk_score}")

# Save the trained models to files
joblib.dump(rf_classifier_eligibility, "best_loan_eligibility_model.pkl")
joblib.dump(rf_regressor_loan_amount, "best_loan_amount_model.pkl")
joblib.dump(rf_regressor_repayment_period, "best_repayment_period_model.pkl")
# joblib.dump(rf_regressor_emi, "best_emi_model.pkl")
joblib.dump(rf_regressor_risk_score, "best_risk_score_model.pkl")

 # Convert input data to DataFrame
def predict_loan_details(input_data): 
    df = pd.DataFrame([input_data])
    
    # Drop non-essential columns and columns that are not numeric or categorical for modeling
    drop_columns = ["Full_Name", "Address", "PAN_Number", "Company_Name", "Bank_Name", "Education_Level", "Job_Title"]
    df = df.drop(columns=drop_columns)
    
    # Handle categorical columns if any (convert to categorical type)
    categorical_cols = ["Owns_House", "Marital_Status", "Dependents", "Loan_Purpose"]
    for col in categorical_cols:
        df[col] = df[col].astype("category")
    
    # Convert date columns to numerical features
    df["Date_Previous_Hike"] = pd.to_datetime(df["Date_Previous_Hike"])
    df["Date_Next_Hike"] = pd.to_datetime(df["Date_Next_Hike"])
    df["Months_Since_Previous_Hike"] = (pd.Timestamp.now() - df["Date_Previous_Hike"]).dt.days / 30
    df["Months_Until_Next_Hike"] = (df["Date_Next_Hike"] - pd.Timestamp.now()).dt.days / 30
    
    # Drop the original date columns
    df = df.drop(columns=["Date_Previous_Hike", "Date_Next_Hike"])
    
    # Set Rent_Amount to 0 if Owns_House is "Yes"
    df.loc[df["Owns_House"] == "Yes", "Rent_Amount"] = 0
    
    # Load the column transformer and apply one-hot encoding to categorical columns
    ct = joblib.load("column_transformer.pkl")
    df = ct.transform(df)
    
    # Load the trained models
    rf_classifier_eligibility = joblib.load("best_loan_eligibility_model.pkl")
    rf_regressor_loan_amount = joblib.load("best_loan_amount_model.pkl")
    rf_regressor_repayment_period = joblib.load("best_repayment_period_model.pkl")
    rf_regressor_emi = joblib.load("best_emi_model.pkl")
    rf_regressor_risk_score = joblib.load("best_risk_score_model.pkl")
    
    # Predict loan eligibility
    eligibility = rf_classifier_eligibility.predict(df)[0]
    
    # Predict loan amount
    loan_amount = rf_regressor_loan_amount.predict(df)[0]
    
    # Predict repayment period
    repayment_period = rf_regressor_repayment_period.predict(df)[0]
    
    # Predict EMI
    # emi = rf_regressor_emi.predict(df)[0]
    emi  = loan_amount/repayment_period
    
    # Predict risk score
    risk_score = rf_regressor_risk_score.predict(df)[0]
    
    return {
        "Eligibility": eligibility,
        "Requested_Loan_Amount": loan_amount,
        "Preferred_Repayment_Period": repayment_period,
        "EMI": emi,
        "Risk_Score": risk_score
    }

# Example usage
input_data = {
    "Full_Name": "John Doe",
    "Address": "123 Elm St",
    "PAN_Number": "ABCDE1234F",
    "Company_Name": "XYZ Corp",
    "Current_Salary": 60000,
    "Previous_Salary": 45000,
    "Owns_House": "No",
    "Rent_Amount": 8000,  # This will be ignored because Owns_House is "Yes"
    "Grocery_Expense": 3000,
    "Current_EMIs": 1900,
    "Date_Previous_Hike": "2022-01-01",
    "Date_Next_Hike": "2023-01-01",
    "Bank_Name": "ABC Bank",
    "Credit_Score": 750,
    "Number_of_Credit_Cards": 2,
    "Total_Credit_Limit": 50000,
    "Number_of_Loans": 1,
    "Employment_Duration": 2 ,
    "Job_Title": "Software Engineer",
    "Bonuses_Allowances": 5000,
    "Savings": 25000,
    "Investments": 37000,
    "Monthly_Expenses": 29000,
    "Age": 30,
    "Education_Level": "Graduate",
    "Marital_Status": "Married",
    "Dependents": 2,
    "Loan_Purpose": "Home Improvement",
    # "Requested_Loan_Amount": 200000,
    # "Preferred_Repayment_Period": 24,
    "Mall_Visits_Per_Month": 8,
    "Mall_Spend_Average": 5000
}

result = predict_loan_details(input_data)
print(result)
