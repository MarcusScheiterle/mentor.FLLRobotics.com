/* 
File Name: Logout.jsx
Author: Simpl1f1ed
Description: This file contains the Logout component, which is responsible for logging the user out and redirecting them to the home page after successful logout.
*/

// Import necessary modules and components
import React, { useEffect } from "react";
import { logout } from "../../firebase.ts";
import { useNavigate } from "react-router-dom";

// Logout component
const Logout = () => {
  // Get the navigation object from react-router-dom
  const navigate = useNavigate();

  // useEffect hook to handle logout and redirection
  useEffect(() => {
    // Function to handle logout process
    const handleLogout = () => {
      try {
        // Call the logout function from firebase.ts to log the user out
        logout();

        // Redirect the user to the home page after successful logout
        navigate("/");
      } catch (error) {
        // Handle any errors that occur during the logout process
        console.error("Logout error:", error);
      }
    };

    // Call the handleLogout function when the component mounts
    handleLogout();
  }, [navigate]); // The useEffect hook will only run once, on component mount

  // JSX content for the Logout component
  return <div>Logging out...</div>;
};

export default Logout;
