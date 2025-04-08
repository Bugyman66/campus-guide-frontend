import React, { useState, useRef, useEffect } from "react";
import { getAIResponse } from "../utils/aiAssistant";
import styled from 'styled-components';
import { Send } from '@mui/icons-material';

const Assistance = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([{
        from: "ai",
        text: "Hello! How can I help you today?"
    }]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Debug logging
    useEffect(() => {
        console.log('Messages updated:', messages);
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        console.log('Sending message:', userMessage);
        
        // Clear input immediately
        setInput("");
        
        // Add user message to chat
        setMessages(prev => [...prev, { from: "user", text: userMessage }]);
        
        setIsLoading(true);
        try {
            const response = await getAIResponse(userMessage);
            console.log('Received AI response:', response);
            
            // Add AI response to chat
            setMessages(prev => [...prev, { from: "ai", text: response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                from: "ai",
                text: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Container>
            <ChatBox>
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} from={msg.from}>
                        <MessageText>{msg.text}</MessageText>
                    </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
            </ChatBox>

            <form onSubmit={handleSubmit}>
                <InputContainer>
                    <StyledInput
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <SendButton type="submit" disabled={isLoading || !input.trim()}>
                        <Send />
                    </SendButton>
                </InputContainer>
            </form>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #1a1a1a;
    color: white;
`;

const ChatHeader = styled.div`
    padding: 1rem;
    background: #2c2c2c;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
`;

const ChatBox = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const MessageBubble = styled.div`
    padding: 0.8rem;
    border-radius: 12px;
    max-width: 80%;
    ${props => props.from === 'user' ? `
        margin-left: auto;
        background: #2196f3;
    ` : `
        margin-right: auto;
        background: #424242;
    `}
`;

const MessageText = styled.div`
    margin-top: 0.5rem;
    word-break: break-word;
`;

const InputContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    background: #2c2c2c;
`;

const StyledInput = styled.input`
    flex: 1;
    padding: 0.8rem;
    border-radius: 8px;
    border: none;
    background: #424242;
    color: white;
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #2196f3;
    }
`;

const SendButton = styled.button`
    padding: 0.8rem;
    border-radius: 8px;
    border: none;
    background: #2196f3;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export default Assistance;
