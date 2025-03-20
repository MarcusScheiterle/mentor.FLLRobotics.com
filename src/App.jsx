import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./Components/Layout/Navbar/Navbar";
import NoPage from "./Components/Layout/NoPage/NoPage";
import Footer from "./Components/Layout/Footer/Footer";
import Home from "./Components/Layout/Home/Home";
import Login from "./Components/Accounts/Login";
import Logout from "./Components/Accounts/Logout";
import Register from "./Components/Accounts/Register";
import Reset from "./Components/Accounts/Reset";
import ViewProfile from "./Components/Accounts/Profiles/ViewProfile";
import MyProfile from "./Components/Accounts/Profiles/MyProfile";

import "./index.scss";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password_reset" element={<Reset />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
          <Footer />
        </Router>
      )}
    </>
  );
}

export default App;
