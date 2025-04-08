import React from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css"; // optional for custom styling

const SplashScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="splash-container">
            <div className="splash-content">
                <h1>Welcome to Campus Guide 🎓</h1>
                <p>Your smart companion to navigate campus life effortlessly.</p>
                <div className="splash-buttons">
                    <button onClick={() => navigate("/register")} className="splash-btn">Register</button>
                    <button onClick={() => navigate("/login")} className="splash-btn secondary">Login</button>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
