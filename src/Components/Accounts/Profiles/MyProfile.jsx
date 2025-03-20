import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  getUserDataByUID,
  addCustomFieldToUserByUID,
} from "./../../../firebase.ts";
import { validateUsername, validateEmail } from "../../../Constants.ts";

import "./profileStyles.scss";

function MyProfile() {
  const [UID, setUID] = useState(null);
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  // Store the initial form data when user data is fetched
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    name: null,
    email: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();

  // Function to validate the username
  const validateUsernameInput = (name) => {
    if (name.trim() === "") {
      return "Error: Username cannot be empty.";
    }
    if (!validateUsername(name)) {
      return "Error: This is not a valid username. Example: Foo.Bar_13-1";
    }
    return null;
  };

  // Function to validate the email
  const validateEmailInput = (email) => {
    if (email.trim() === "") {
      return "Error: Email cannot be empty.";
    }
    if (!validateEmail(email)) {
      return "Error: This is not a valid email. Example: foobar13@gmail.com";
    }
    return null;
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Perform validation for each field and update the errors state
    if (name === "name") {
      const error = validateUsernameInput(value);
      setErrors((prevErrors) => ({ ...prevErrors, name: error }));
      if (error) {
        e.target.parentElement.classList.add("errored");
      } else {
        e.target.parentElement.classList.remove("errored");
      }
    } else if (name === "email") {
      const error = validateEmailInput(value);
      setErrors((prevErrors) => ({ ...prevErrors, email: error }));
      if (error) {
        e.target.parentElement.classList.add("errored");
      } else {
        e.target.parentElement.classList.remove("errored");
      }
    }
  };

  // Function to check if form data has changed
  const hasFormDataChanged = useCallback(() => {
    return (
      formData.name !== initialFormData.name ||
      formData.email !== initialFormData.email
    );
  }, [formData, initialFormData]);

  // Function to handle data update
  const handleDataUpdate = async () => {
    // If data is already being updated or the update button is disabled, do nothing
    if (isUpdating || updateDisabled || isRunning) {
      return;
    }

    // Set isUpdating to true to prevent concurrent updates
    setIsUpdating(true);

    // Validate form data before updating
    const nameError = validateUsernameInput(formData.name);
    const emailError = validateEmailInput(formData.email);

    // Set errors if validation fails
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: nameError,
      email: emailError,
    }));

    // If there are validation errors, add "errored" class to the corresponding fields
    if (nameError) {
      document.getElementById("name").parentElement.classList.add("errored");
    }
    if (emailError) {
      document.getElementById("email").parentElement.classList.add("errored");
    }

    // If there are validation errors or no changes have been made, prevent data update
    if (nameError || emailError || !hasFormDataChanged()) {
      setIsUpdating(false);
      return;
    }

    // Proceed with updating data if form data is valid
    let hasChanges = false;

    if (formData.name !== initialFormData.username && formData.name !== "") {
      try {
        await addCustomFieldToUserByUID(
          UID,
          "public",
          "username",
          formData.name
        );
        setErrors((prevErrors) => ({ ...prevErrors, name: null }));
        hasChanges = true;
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Error updating username: " + error.message,
        }));
      }
    }

    if (formData.email !== initialFormData.email && formData.email !== "") {
      try {
        await addCustomFieldToUserByUID(UID, "public", "email", formData.email);
        setErrors((prevErrors) => ({ ...prevErrors, email: null }));
        hasChanges = true;
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Error updating email: " + error.message,
        }));
      }
    }

    // Reset form data and errors if changes have been made
    if (hasChanges) {
      setFormData({
        name: formData.name,
        email: formData.email,
      });
      setInitialFormData({
        name: formData.name,
        email: formData.email,
      });
      setErrors({
        name: null,
        email: null,
      });
    }

    handleUpdateComplete(); // Call the function to handle update completion
  };

  // Function to handle update completion
  const handleUpdateComplete = () => {
    setIsUpdating(false); // Reset isUpdating to false
    setTimer(60);
    setIsRunning(true);
  };

  // Enable the update button if the form data has changed
  useEffect(() => {
    setUpdateDisabled(!hasFormDataChanged());
  }, [formData, hasFormDataChanged]); // Add formData and hasFormDataChanged as dependencies to the useEffect

  // Wait until the user is loaded before setting the UID
  useEffect(() => {
    if (!loading && user) {
      setUID(user.uid);
    }
  }, [loading, user]);

  // Check if the user is signed in and navigate to the homepage if not
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    let intervalId;

    if (isRunning && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsRunning(false);
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer, isRunning]);

  // Fetch user data when the UID is available (user object is loaded)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ensure UID is valid before proceeding
        if (!UID) {
          setErrors("User not logged in");
          return;
        }

        const { data, error } = await getUserDataByUID(UID, "public", [
          "username",
          "email",
        ]);

        if (error) {
          setErrors(error);
        } else {
          // Set the initial form data with the fetched user data
          setUserData(data);
          setFormData({
            name: data.username || "",
            email: data.email || "",
          });

          // Store the initial form data for comparison
          setInitialFormData({
            name: data.username || "",
            email: data.email || "",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    // Fetch user data only if UID is valid (user object is loaded)
    if (UID) {
      fetchUserData();
    }
  }, [UID]);

  return (
    <div id="Profile" className="page">
      {userData ? (
        <>
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
            {errors.name && <div className="errorMessage">{errors.name}</div>}
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
            {errors.email && <div className="errorMessage">{errors.email}</div>}
          </div>
          <button
            disabled={updateDisabled || isRunning}
            onClick={handleDataUpdate}
            className={updateDisabled ? "deactivated" : ""}
          >
            {isRunning ? <>Please wait {timer} seconds before another update</> : "Update"}
          </button>
        </>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}

export default MyProfile;
