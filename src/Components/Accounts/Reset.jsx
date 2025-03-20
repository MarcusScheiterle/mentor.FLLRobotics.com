/*
File Name: Reset.jsx
Author: Simpl1f1ed
Description: This file contains the Reset component, which handles the password reset functionality for the user. It uses Firebase's authentication to send a password reset email to the provided email address.
*/

// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordReset } from "./../../firebase.ts";
import "./style.scss";
import { validateEmail } from "./../../Constants.ts";

function Reset() {
  // State variable to hold user input (email)
  const [email, setEmail] = useState("");

  // Check if user is logged in, and loading state
  const [user, loading] = useAuthState(auth);

  // Get the navigation object
  const navigate = useNavigate();

  // Function to handle password reset
  const handleReset = () => {
    const errorMessageElem = document.getElementById("erorrMessage");
    const emailElem = document.getElementById("email").parentElement;

    // Validate the email input
    if (!validateEmail(email)) {
      emailElem.classList.add("errored");
      errorMessageElem.innerHTML =
        "Error: This is not a valid email Ex: foobar13@gmail.com";
      return;
    }
    emailElem.classList.remove("errored");

    // Call the sendPasswordReset function to handle the password reset process
    sendPasswordReset(
      email,
      document.getElementsByClassName("resetInput"),
      document.getElementById("erorrMessage")
    );
  };

  // UseEffect hook to handle page title and navigation
  useEffect(() => {
    // If the user is already logged in, redirect to home page
    if (user) navigate("/");

    // Set the page title
    document.title = "Simpl1f1ed.com - Reset";

    // Clean up function to reset the page title on component unmount
    return () => {
      document.title = "Simpl1f1ed.com";
    };
  }, [user, navigate, loading]);

  // JSX content for the Reset component
  return (
    <div id="Reset" className="page center">
      <div className="container">
        <div className="section">
          <div className="flex-row">
            {/* Email input */}
            <label className="errorLabel" htmlFor="email">
              {/* SVG icon for error */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </svg>
            </label>
            <label htmlFor="email">
              {/* SVG icon for email */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </label>
            <input
              id="email"
              placeholder="Email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Element to display error message */}
          <p id="erorrMessage"></p>
          {/* Send Reset Email button */}
          <button onClick={() => handleReset()}>Send Reset Email</button>
        </div>
      </div>
    </div>
  );
}

export default Reset;
