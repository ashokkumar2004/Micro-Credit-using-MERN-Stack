export const validate = (data, type) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = "Email is Required!";
  } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.email).toLowerCase())) {
    errors.email = "Email address is invalid!";
  } else {
    delete errors.email;
  }

  // Username validation
  if (!data.username) {
    errors.username = "Username is required!";
  } else if (!/^[a-zA-Z0-9_]{5,20}$/.test(data.username)) {
    errors.username = "Username must be 5-20 characters long and can include letters, numbers, and underscores.";
  } else {
    delete errors.username;
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is Required";
  } else if (!(data.password.length >= 6)) {
    errors.password = "Password needs to be 6 characters or more";
  } else {
    delete errors.password;
  }

  // Confirm password validation (only for signUp)
  if (type === "signUp") {
    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm the Password";
    } else if (!(data.confirmPassword === data.password)) {
      errors.confirmPassword = "Passwords do not match!";
    } else {
      delete errors.confirmPassword;
    }

    // Terms acceptance validation (only for signUp)
    if (!data.IsAccepted) {
      errors.IsAccepted = "Accept terms!";
    } else {
      delete errors.IsAccepted;
    }
  }

  return errors;
};
