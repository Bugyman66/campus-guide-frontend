import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Send, SmartToy } from '@mui/icons-material';

const AIAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessages(prev => [...prev, { 
                    type: 'assistant', 
                    content: data.response 
                }]);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setMessages(prev => [...prev, { 
                type: 'assistant', 
                content: 'Sorry, I encountered an error. Please try again.',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <ChatWindow>
                <Header>
                    <SmartToy sx={{ color: '#63f5ef', fontSize: 28 }} />
                    <Title>Campus AI Assistant</Title>
                </Header>

                <MessagesContainer>
                    <WelcomeMessage>
                        Hello! I'm your campus assistant. How can I help you today?
                    </WelcomeMessage>
                    {messages.map((msg, index) => (
                        <Message
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            $isUser={msg.type === 'user'}
                            $isError={msg.isError}
                        >
                            {msg.content}
                        </Message>
                    ))}
                    {isLoading && (
                        <LoadingDots>
                            <dot>.</dot><dot>.</dot><dot>.</dot>
                        </LoadingDots>
                    )}
                    <div ref={messagesEndRef} />
                </MessagesContainer>

                <InputForm onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        disabled={isLoading}
                    />
                    <SendButton
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Send />
                    </SendButton>
                </InputForm>
            </ChatWindow>
        </Container>
    );
};

const Container = styled.div`
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ChatWindow = styled.div`
    width: 100%;
    max-width: 800px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 80vh;
`;

const Header = styled.div`
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Title = styled.h2`
    color: #fff;
    font-family: 'Orbitron', sans-serif;
    margin: 0;
`;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Message = styled(motion.div)`
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 80%;
    align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
    background: ${props => props.$isUser ? 
        'linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%)' : 
        'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$isError ? '#ff6b6b' : '#fff'};
    font-family: 'Rajdhani', sans-serif;
`;

const WelcomeMessage = styled.div`
    text-align: center;
    color: #63f5ef;
    font-family: 'Rajdhani', sans-serif;
    padding: 20px;
`;

const InputForm = styled.form`
    display: flex;
    gap: 12px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
`;

const Input = styled.input`
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    padding: 12px 16px;
    border-radius: 12px;
    color: white;
    font-family: 'Rajdhani', sans-serif;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #63f5ef;
    }
`;

const SendButton = styled(motion.button)`
    background: linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%);
    border: none;
    border-radius: 12px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LoadingDots = styled.div`
    display: flex;
    justify-content: center;
    gap: 4px;
    color: #63f5ef;
    font-size: 24px;

    dot {
        animation: bounce 1s infinite;
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;

export default AIAssistant;
