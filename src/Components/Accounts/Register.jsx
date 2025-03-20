/* 
File Name: Register.jsx
Author: Simpl1f1ed
Description: This file contains the Register component, which is responsible for user registration and validation of user input. It also handles redirection based on the user's login status.
*/

// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./../../firebase.ts";
import "./style.scss";
import {
  validateEmail,
  validateMediumPassword,
  validateUsername,
} from "./../../Constants.ts";

function Register() {
  // State variables to hold user input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State variable to hold error message
  const [error, setError] = useState("");

  // Check if user is logged in, and loading state
  const [user, loading] = useAuthState(auth);

  // Get the navigation object
  const navigate = useNavigate();

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Function to validate form data
  const validateFormData = () => {
    const { name, email, password } = formData;

    // Validate the username input
    if (!validateUsername(name)) {
      return "Error: This is not a valid username. Example: Foo.Bar_13-1";
    }

    // Validate the email input
    if (!validateEmail(email)) {
      return "Error: This is not a valid email. Example: foobar13@gmail.com";
    }

    // Validate the password input
    if (!validateMediumPassword(password)) {
      return "Error: This is not a strong enough password. [8 characters long with 1 number and 1 special character]";
    }

    return null; // Return null if validation passes
  };

  // Function to handle user registration
  const handleRegister = () => {
    // Validate form data
    const validationError = validateFormData();

    // If validation fails, set the error message and return
    if (validationError) {
      setError(validationError);
      return;
    }

    // Call the registerWithEmailAndPassword function to handle registration
    registerWithEmailAndPassword(
      formData.name,
      formData.email,
      formData.password,
      [
        document.getElementById("name").parentElement,
        document.getElementById("email").parentElement,
        document.getElementById("password").parentElement,
      ],
      document.getElementById("errorMessage")
    );
  };

  // UseEffect hook to handle page title and navigation
  useEffect(() => {
    // If the user is already logged in, redirect to home page
    if (user) navigate("/");

    // Set the page title
    document.title = "Simpl1f1ed.com - Register";

    // Clean up function to reset the page title on component unmount
    return () => {
      document.title = "Simpl1f1ed.com";
    };
  }, [user, navigate, loading]);

  // JSX content for the Register component
  return (
    <div id="Register" className="page center">
      <div className="container">
        <div className="section">
          {/* Username input */}
          <div className="flex-row">
            <label className="errorLabel" htmlFor="name">
              {/* SVG icon for error */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </svg>
            </label>
            <input
              id="name"
              name="name"
              placeholder="Username"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {/* Email input */}
          <div className="flex-row">
            <label className="errorLabel" htmlFor="email">
              {/* SVG icon for error */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </svg>
            </label>
            <input
              id="email"
              name="email"
              placeholder="Email"
              type="text"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* Password input */}
          <div className="flex-row">
            <label className="errorLabel" htmlFor="password">
              {/* SVG icon for error */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </svg>
            </label>
            <input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {/* Element to display error message */}
          <p id="errorMessage">{error}</p>
          {/* Register button */}
          <button onClick={handleRegister}>Register</button>
        </div>
        <div className="section">
          {/* Google sign-in provider */}
          <div className="providers">
            <div className="provider Google" onClick={signInWithGoogle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                {/* Google SVG icon */}
              </svg>
              <div>Google</div>
            </div>
          </div>
          {/* Alternate options */}
          <div className="alternateOptions">
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
