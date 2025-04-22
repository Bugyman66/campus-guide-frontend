import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LocationOn, AttachMoney, Description, Book } from "@mui/icons-material";

const Accommodations = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [message, setMessage] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/api/accommodations")
            .then((res) => res.json())
            .then((data) => setAccommodations(data))
            .catch((err) => console.error("Error fetching data:", err));

        // Fetch transaction history
        const fetchTransactions = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch("http://localhost:5000/api/bookings/my-bookings", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
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

            <TransactionSection
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <TransactionHeader>
                    <TransactionTitle>Transaction History</TransactionTitle>
                    <ToggleButton
                        onClick={() => setShowTransactions(!showTransactions)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {showTransactions ? 'Hide' : 'Show'} Transactions
                    </ToggleButton>
                </TransactionHeader>

                {showTransactions && (
                    <TransactionGrid
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <TransactionInfo>
                                        <strong>Accommodation:</strong> 
                                        {transaction.accommodation?.name || 'N/A'}
                                    </TransactionInfo>
                                    <TransactionInfo>
                                        <strong>Status:</strong>
                                        <StatusBadge status={transaction.status}>
                                            {transaction.status}
                                        </StatusBadge>
                                    </TransactionInfo>
                                    <TransactionInfo>
                                        <strong>Reference:</strong> 
                                        {transaction.reference || 'N/A'}
                                    </TransactionInfo>
                                    <TransactionInfo>
                                        <strong>Date:</strong>
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                    </TransactionInfo>
                                </TransactionCard>
                            ))
                        ) : (
                            <NoTransactions>No transactions found</NoTransactions>
                        )}
                    </TransactionGrid>
                )}
            </TransactionSection>
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

const TransactionSection = styled(motion.div)`
    margin-top: 40px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(10px);
`;

const TransactionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const TransactionTitle = styled.h2`
    font-family: 'Orbitron', sans-serif;
    color: #63f5ef;
    margin: 0;
`;

const ToggleButton = styled(motion.button)`
    background: linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    font-family: 'Rajdhani', sans-serif;
`;

const TransactionGrid = styled(motion.div)`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const TransactionCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.08);
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TransactionInfo = styled.div`
    margin: 8px 0;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Rajdhani', sans-serif;
    
    strong {
        color: #63f5ef;
        margin-right: 8px;
    }
`;

const StatusBadge = styled.span`
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.875rem;
    background: ${props => 
        props.status === 'Paid' ? 'rgba(99, 245, 239, 0.1)' :
        props.status === 'Pending' ? 'rgba(255, 193, 7, 0.1)' :
        'rgba(239, 83, 80, 0.1)'};
    color: ${props => 
        props.status === 'Paid' ? '#63f5ef' :
        props.status === 'Pending' ? '#ffc107' :
        '#ef5350'};
`;

const NoTransactions = styled.div`
    grid-column: 1 / -1;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    padding: 20px;
    font-family: 'Rajdhani', sans-serif;
`;

export default Accommodations;