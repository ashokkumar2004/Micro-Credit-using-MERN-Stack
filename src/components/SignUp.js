import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported
import axios from "axios";
import { validate } from "./validate";
import styles from "./SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";

// Icons
import userIcon from "../img/user.svg";
import emailIcon from "../img/email.svg";
import passwordIcon from "../img/password.svg";

const SignUp = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (data.username) {
        try {
          const response = await axios.post('http://localhost:5000/check-username', { username: data.username });
          setUsernameAvailable(response.status === 200);
        } catch (error) {
          console.error('Error checking username availability:', error);
          setUsernameAvailable(false);
        }
      }
    };

    checkUsernameAvailability();
  }, [data.username]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (data.email) {
        try {
          const response = await axios.post('http://localhost:5000/check-email', { email: data.email });
          setEmailAvailable(response.status === 200);
        } catch (error) {
          console.error('Error checking email availability:', error);
          setEmailAvailable(false);
        }
      }
    };

    checkEmailAvailability();
  }, [data.email]);

  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!Object.keys(errors).length && usernameAvailable && emailAvailable) {
      try {
        const response = await axios.post('http://localhost:5000/signup', data);
        if (response.status === 201) {
          toast.success("Sign up successful", {
            autoClose: 1000, // Close the toast after 1 second
            onClose: () => navigate("/login") // Redirect to the login page after the toast message
          });
        }
      } catch (error) {
        toast.error(`Signup failed: ${error.response?.data?.error || error.message}`);
      }
    } else {
      toast.error("Please check fields again");
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        IsAccepted: true,
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign Up</h2>
        <div>
          <div className={errors.username && touched.username ? styles.unCompleted : !errors.username && touched.username ? styles.completed : undefined}>
            <input type="text" name="username" value={data.username} placeholder="Username" onChange={changeHandler} onBlur={focusHandler} autoComplete="off" />
            <img src={userIcon} alt="" />
          </div>
          {errors.username && touched.username && <span className={styles.error}>{errors.username}</span>}
          {!usernameAvailable && <span className={styles.error}>Username already taken</span>}
        </div>
        <div>
          <div className={errors.email && touched.email ? styles.unCompleted : !errors.email && touched.email ? styles.completed : undefined}>
            <input type="text" name="email" value={data.email} placeholder="E-mail" onChange={changeHandler} onBlur={focusHandler} autoComplete="off" />
            <img src={emailIcon} alt="" />
          </div>
          {errors.email && touched.email && <span className={styles.error}>{errors.email}</span>}
          {!emailAvailable && <span className={styles.error}>Email already registered</span>}
        </div>
        <div>
          <div className={errors.password && touched.password ? styles.unCompleted : !errors.password && touched.password ? styles.completed : undefined}>
            <input type="password" name="password" value={data.password} placeholder="Password" onChange={changeHandler} onBlur={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="" />
          </div>
          {errors.password && touched.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div>
          <div className={errors.confirmPassword && touched.confirmPassword ? styles.unCompleted : !errors.confirmPassword && touched.confirmPassword ? styles.completed : undefined}>
            <input type="password" name="confirmPassword" value={data.confirmPassword} placeholder="Confirm Password" onChange={changeHandler} onBlur={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="" />
          </div>
          {errors.confirmPassword && touched.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
        </div>
        <div>
          <label>
            <input type="checkbox" name="IsAccepted" checked={data.IsAccepted} onChange={changeHandler} />
            Accept terms and conditions
          </label>
          {errors.IsAccepted && touched.IsAccepted && <span className={styles.error}>{errors.IsAccepted}</span>}
        </div>
        <button type="submit">Sign Up</button>
        <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
          Already have an account? <Link to="/login">Log in here</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
