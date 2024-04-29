import React, { useState } from 'react';
import './signup.css';
import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

import axios from "../../axios"

import { useNavigate, useLocation } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
  });

  const location = useLocation();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popUpText, setpopUpText] = useState("")
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const blurredBackgroundStyles = isBackgroundBlurred
    ? {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(100, 100, 100, 0.5)",
      backdropFilter: "blur(1.8px)",
      zIndex: 1,
    }
    : {};

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userType = "customer"
      if (location.pathname.includes("/supplier")) {
        userType = "supplier"
      }
      const response = await axios.post(`/auth/${userType}-register`, {
        email: userDetails.email,
        password: userDetails.password,
        name: userDetails.name
      });
      setpopUpText("Successfully Registered!!!");
      setIsPopUpOpen(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error?.response?.data?.message) {
        setpopUpText(error?.response?.data?.message);
      }
      else {
        setpopUpText("Something Went Wrong")
      }
      setIsPopUpOpen(true);
    }
  };

  return (
    <div className="register-container">
      {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
      {loading && <Loader />}
      <div className="form-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userDetails.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userDetails.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
};

export default Register;
