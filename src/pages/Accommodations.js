import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LocationOn, AttachMoney, Description, Book } from "@mui/icons-material";

const Accommodations = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/accommodations")
            .then((res) => res.json())
            .then((data) => setAccommodations(data))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    // Helper function to validate email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleBooking = async (accommodationId) => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user?.email;
    
        if (!token) {
            setMessage("Please login to book accommodation");
            return;
        }

        if (!userEmail || !isValidEmail(userEmail)) {
            setMessage("Invalid email. Please update your profile");
            return;
        }

        try {
            setMessage("Processing your booking...");
            
            const response = await fetch("http://localhost:5000/api/bookings/pay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    accommodationId, 
                    userEmail,
                    metadata: {
                        user_id: user.id,
                        accommodation_id: accommodationId
                    }
                })
            });
    
            const data = await response.json();
            
            if (response.ok && data.authorization_url) {
                localStorage.setItem("paystack_reference", data.reference);
                window.location.href = data.authorization_url;
            } else {
                setMessage(data.msg || "Payment initialization failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            setMessage("Something went wrong. Please try again later.");
        }
    };

    return (
        <Container>
            <BackgroundAnimation />
            <ContentWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Header
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Title>Campus Accommodations</Title>
                    <Subtitle>Find your perfect student housing</Subtitle>
                </Header>

                {message && (
                    <Message
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {message}
                    </Message>
                )}

                <AccommodationGrid>
                    {accommodations.map((acc, index) => (
                        <AccommodationCard
                            key={acc._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <AccommodationName>{acc.name}</AccommodationName>
                            
                            <InfoItem>
                                <LocationOn sx={{ color: "#63f5ef" }} />
                                <span>{acc.location}</span>
                            </InfoItem>
                            
                            <InfoItem>
                                <AttachMoney sx={{ color: "#63f5ef" }} />
                                <span>₦{acc.price.toLocaleString()}</span>
                            </InfoItem>
                            
                            <InfoItem>
                                <Description sx={{ color: "#63f5ef" }} />
                                <span>{acc.description}</span>
                            </InfoItem>

                            <BookButton
                                onClick={() => handleBooking(acc._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Book sx={{ marginRight: "8px" }} />
                                Book Now
                            </BookButton>
                        </AccommodationCard>
                    ))}
                </AccommodationGrid>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    position: relative;
    overflow: hidden;
`;

const BackgroundAnimation = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, #16213e 70%);
    opacity: 0.5;
    animation: pulse 4s ease-in-out infinite;

    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.5; }
    }
`;

const ContentWrapper = styled(motion.div)`
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
`;

const Header = styled(motion.div)`
    text-align: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-family: 'Orbitron', sans-serif;
    color: #fff;
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(to right, #4a90e2, #63f5ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-family: 'Rajdhani', sans-serif;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    margin: 10px 0 0 0;
`;

const Message = styled(motion.div)`
    background: rgba(99, 245, 239, 0.1);
    color: #63f5ef;
    padding: 15px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 30px;
    font-family: 'Rajdhani', sans-serif;
`;

const AccommodationGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    padding: 20px 0;
`;

const AccommodationCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AccommodationName = styled.h3`
    font-family: 'Orbitron', sans-serif;
    color: #63f5ef;
    font-size: 1.5rem;
    margin: 0 0 20px 0;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Rajdhani', sans-serif;
`;

const BookButton = styled(motion.button)`
    width: 100%;
    background: linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%);
    border: none;
    border-radius: 12px;
    padding: 12px;
    color: white;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;

export default Accommodations;