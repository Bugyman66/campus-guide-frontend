import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const [message, setMessage] = useState("Verifying payment...");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const reference = new URLSearchParams(window.location.search).get("reference");
        if (reference) {
            fetch(`http://localhost:5000/api/bookings/verify/${reference}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.booking) {
                        setMessage("Payment successful! Your booking is confirmed.");
                    } else {
                        setMessage("Payment verification failed. Please contact support.");
                    }
                })
                .catch((err) => {
                    console.error("Error verifying payment:", err);
                    setMessage("Error verifying payment. Try again.");
                });
        } else {
            setMessage("No payment reference found.");
        }
    }, [location]);

    return (
        <div>
            <h2>{message}</h2>
            <a href="/accommodations">Go back to Accommodations</a>
        </div>
    );
};

export default PaymentSuccess;
