import React from "react";
import { getUser } from "../utils/auth";

const Dashboard = () => {
    const user = getUser();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "/login";
    };

    return (
        <div>
            {user ? (
                <>
                    <h1>Welcome, {user.name}!</h1>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
