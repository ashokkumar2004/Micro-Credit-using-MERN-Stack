from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# # Load the column transformer and models
ct = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/column_transformer.pkl")
rf_classifier_eligibility = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/best_loan_eligibility_model.pkl")
rf_regressor_loan_amount = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/best_loan_amount_model.pkl")
rf_regressor_repayment_period = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/best_repayment_period_model.pkl")
# rf_regressor_emi = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/best_emi_model.pkl")
rf_regressor_risk_score = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/best_risk_score_model.pkl")

# Load the column transformer and models
# ct = joblib.load("C:/Users/balaj/Downloads/VueJs/my-app/column_transformer.pkl")
# rf_classifier_eligibility = joblib.load("best_loan_eligibility_model.pkl")
# rf_regressor_loan_amount = joblib.load("best_loan_amount_model.pkl")
# rf_regressor_repayment_period = joblib.load("best_repayment_period_model.pkl")
# # rf_regressor_emi = joblib.load("best_emi_model.pkl")
# rf_regressor_risk_score = joblib.load("best_risk_score_model.pkl")

# Define compound interest calculation function
def calculate_loan_amount(emi, repayment_period, monthly_interest_rate):
    if emi <= 0:
        return 0
    monthly_interest_rate /= 100  # Convert percentage to decimal
    num_payments = repayment_period
    loan_amount = emi * (1 - (1 + monthly_interest_rate) ** -num_payments) / monthly_interest_rate
    return round(loan_amount, 2)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json
        df = pd.DataFrame([input_data])

        # Add default values for loan EMIs and tenures if not provided
        default_values = {
            "loan1_EMI": 0,
            "loan1_Tenure": 0,
            "loan2_EMI": 0,
            "loan2_Tenure": 0,
            "loan3_EMI": 0,
            "loan3_Tenure": 0
        }
        for col, default in default_values.items():
            if col not in df.columns or pd.isna(df[col]).all():
                df[col] = default
        
        # Set Rent Amount to 0 if Owns_House is "Yes"
        if "Owns_House" in df.columns and df["Owns_House"].iloc[0] == "Yes":
            df["Rent_Amount"] = 0

        # Set Loan EMIs and Loan Tenures to 0 if Number_of_Loans is 0
        if "Number_of_Loans" in df.columns and df["Number_of_Loans"].iloc[0] == 0:
            df["loan1_EMI"] = 0
            df["loan1_Tenure"] = 0
            df["loan2_EMI"] = 0
            df["loan2_Tenure"] = 0
            df["loan3_EMI"] = 0
            df["loan3_Tenure"] = 0

        drop_columns = ["Full_Name", "Address", "PAN_Number", "Company_Name", "Bank_Name", "Education_Level", "Job_Title"]
        df = df.drop(columns=drop_columns, errors='ignore')
        
        categorical_cols = ["Owns_House", "Marital_Status", "Loan_Purpose"]
        for col in categorical_cols:
            if (col in df.columns) and (df[col].dtype == 'object'):
                df[col] = df[col].astype("category")
        
        if "Date_Previous_Hike" in df.columns and "Date_Next_Hike" in df.columns:
            df["Date_Previous_Hike"] = pd.to_datetime(df["Date_Previous_Hike"])
            df["Date_Next_Hike"] = pd.to_datetime(df["Date_Next_Hike"])
            df["Months_Since_Previous_Hike"] = (pd.Timestamp.now() - df["Date_Previous_Hike"]).dt.days / 30
            df["Months_Until_Next_Hike"] = (df["Date_Next_Hike"] - pd.Timestamp.now()).dt.days / 30
            df = df.drop(columns=["Date_Previous_Hike", "Date_Next_Hike"])

        df_transformed = ct.transform(df)
        
        eligibility = int(rf_classifier_eligibility.predict(df_transformed)[0])
        
        if eligibility == 0:
            return jsonify({"Eligibility": eligibility})

        # Predict values from models
        loan_amount_predicted = float(rf_regressor_loan_amount.predict(df_transformed)[0])
        repayment_period_predicted = round(rf_regressor_repayment_period.predict(df_transformed)[0])
        emi_predicted = round(loan_amount_predicted / repayment_period_predicted)  # Adjust if you have a separate model for EMI
        risk_score_predicted = round(float(rf_regressor_risk_score.predict(df_transformed)[0]), 2)
        
        # Calculate the actual loan amount including monthly interest
        monthly_interest_rate = 1  # Monthly interest rate is 1%
        loan_amount_actual = calculate_loan_amount(emi_predicted, repayment_period_predicted, monthly_interest_rate)
        
        return jsonify({
            "Eligibility": round(eligibility),
            "Requested_Loan_Amount_Predicted": round(loan_amount_predicted),
            "Preferred_Repayment_Period": round(repayment_period_predicted),
            "EMI_Predicted": round(emi_predicted),
            "Risk_Score": round(risk_score_predicted),
            "Requested_Loan_Amount_Actual": round(loan_amount_actual)
        })
    except Exception as e:
        error_message = str(e)
        print(f"Error: {error_message}")
        return jsonify({"error": error_message}), 400

if __name__ == '__main__':
    app.run(debug=True)