import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TextField, InputAdornment } from '@mui/material';
import { EmailOutlined, LockOutlined } from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://campus-guide-backend-n015.onrender.com/api/auth/login',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container>
            <BackgroundAnimation />
            <LoginCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <LogoText
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    CampusGuide
                </LogoText>
                
                <Title>Welcome Back</Title>
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <Form onSubmit={handleSubmit}>
                    <InputWrapper>
                        <StyledTextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined sx={{ color: '#4a90e2' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </InputWrapper>

                    <InputWrapper>
                        <StyledTextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined sx={{ color: '#4a90e2' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </InputWrapper>

                    <LoginButton
                        type="submit"
                        as={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </LoginButton>
                </Form>

                <RegisterLink 
                        to="/register"
                        component={Link}
                        whileHover={{ scale: 1.05 }}
                    >
                        Don't have an account? Sign up
            </RegisterLink>
            </LoginCard>
        </Container>
    );
};

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 20px;
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

const LoginCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 48px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 1;

    @media (max-width: 480px) {
        padding: 24px;
    }
`;

const LogoText = styled(motion.h1)`
    font-family: 'Orbitron', sans-serif;
    color: #fff;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 8px;
    background: linear-gradient(to right, #4a90e2, #63f5ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Title = styled.h2`
    color: #fff;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 32px;
    font-family: 'Rajdhani', sans-serif;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const InputWrapper = styled.div`
    width: 100%;
`;

const StyledTextField = styled(TextField)`
    && {
        .MuiOutlinedInput-root {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            color: #fff;
            
            & fieldset {
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            &:hover fieldset {
                border-color: rgba(255, 255, 255, 0.3);
            }
            
            &.Mui-focused fieldset {
                border-color: #4a90e2;
            }
        }
        
        .MuiInputLabel-root {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .MuiOutlinedInput-input {
            color: #fff;
        }
    }
`;

const LoginButton = styled.button`
    background: linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%);
    border: none;
    border-radius: 12px;
    padding: 16px;
    color: #fff;
    font-size: 1.1rem;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: #ff6b6b;
    text-align: center;
    margin-bottom: 16px;
    font-family: 'Rajdhani', sans-serif;
    animation: fadeIn 0.3s ease-in;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const RegisterLink = styled(motion(Link))`
    color: #4a90e2;
    text-decoration: none;
    text-align: center;
    display: block;
    margin-top: 24px;
    font-family: 'Rajdhani', sans-serif;
    transition: color 0.3s ease;

    &:hover {
        color: #63f5ef;
    }
`;

export default Login;