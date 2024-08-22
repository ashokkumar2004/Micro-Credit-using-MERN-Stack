// importing all the necessary modules.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailIcon from "../img/email.svg";
import passwordIcon from "../img/password.svg";
import styles from "./SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";
// using Use state method from the hooks to call upon the inputs.
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
// using route as the /login for the login page.
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', data);
      if (response.data.token) {
        toast.success("Logged in successfully", {
          autoClose: 1000, // Close the toast after 1 second
          onClose: () => navigate("/loan-form") // Redirect to the loan form page after the toast message
        });
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error(`Error during login: ${error.response?.data?.error || error.message}`);
    }
  };
// inputs for the frontend.
  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign In</h2>
        <div>
          <div>
            <input
              type="email"
              name="email"
              value={data.email}
              placeholder="E-mail"
              onChange={changeHandler}
              autoComplete="off"
              required
            />
            <img src={emailIcon} alt="Email Icon" />
          </div>
        </div>
        <div>
          <div>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={changeHandler}
              autoComplete="off"
              required
            />
            <img src={passwordIcon} alt="Password Icon" />
          </div>
        </div>
        <div>
          <button type="submit">Login</button>
          <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Don't have an account? <Link to="/signup">Create account</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
