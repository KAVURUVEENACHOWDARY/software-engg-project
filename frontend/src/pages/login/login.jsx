import React, { useState } from 'react';
import './login.css';


import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

import axios from "../../axios"

import {useNavigate} from "react-router-dom"


const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            setLoading(true);
            if(props.welcomeText){
                const response = await axios.post("/auth/supplier-login", {
                    email,
                    password
                })
                navigate(`/dashboard/supplier/${response.data.user._id}/${response.data.user.name}`);
            }
            else{
                const response = await axios.post("/auth/customer-login", {
                    email,
                    password
                })
                navigate(`/dashboard/customer/${response.data.user._id}/${response.data.user.name}`);
            }
        }catch(error){
            console.log(error);
            setLoading(false);
            if(error?.response?.data?.message){
                setpopUpText(error?.response?.data?.message);
            }
            else{
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        }
    };

    return (
        <div className="login-container">
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
                {loading && <Loader />}
            <div className="login-background">
                <h2>Welcome Customer Please Login {props.welcomeText}</h2>
                <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <i className="fas fa-user"></i>
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    />
                </div>
                <div className="input-container">
                    <i className="fas fa-lock"></i>
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                </form>
                <p>Not a member? <a href={props.welcomeText? "/supplier/signup" : "/signup"}>Register Here</a></p>
            </div>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </div>
    );
};

export default Login;
