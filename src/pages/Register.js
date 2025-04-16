import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TextField, Button as MuiButton, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [regNo, setRegNo] = useState('');
    const [faculty, setFaculty] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!name || !email || !regNo || !faculty || !department || !password) {
            setError('All fields are required');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(
                'https://campus-guide-backend-n015.onrender.com/api/auth/register',
                {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    regNo: regNo.trim(),
                    faculty,
                    department: department.trim(),
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    const facultyOptions = [
        'Faculty of Computing',
        'Faculty of Art and Social Science',
        'Faculty of Education',
        'Faculty of Physical Science',
        'Faculty of Basic Medical Science',
        'Faculty of Life Science',
        'Faculty of Agriculture',
        'Faculty of Management Science',
        'Faculty of Law'
    ];

    return (
        <Container>
            <GlassCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <LogoText>Campus Guide</LogoText>
                <Title>Register</Title>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)' }}>
                        {error}
                    </Alert>
                )}

                {message && (
                    <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(46, 125, 50, 0.1)' }}>
                        {message}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <StyledTextField
                        label="Full Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <StyledTextField
                        label="Email Address"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <StyledTextField
                        label="Registration Number"
                        variant="outlined"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        required
                    />

                    <StyledTextField
                        select
                        label="Select Faculty"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        required
                    >
                        <option value="">Select Faculty</option>
                        {facultyOptions.map((fac, i) => (
                            <option key={i} value={fac}>{fac}</option>
                        ))}
                    </StyledTextField>

                    <StyledTextField
                        label="Department"
                        variant="outlined"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />

                    <StyledTextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <StyledButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Register'
                        )}
                    </StyledButton>
                </Form>

                <StyledLink to="/login">Already have an account? Login</StyledLink>
            </GlassCard>
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
`;

const GlassCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 48px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);

    @media (max-width: 768px) {
        padding: 24px;
    }
`;

const LogoText = styled.h1`
    font-family: 'Orbitron', sans-serif;
    color:rgb(247, 250, 255);
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 8px;
    background: linear-gradient(to right, #4a90e2, #8f9aff);
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

const StyledTextField = styled(TextField)`
    .MuiOutlinedInput-root {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        
        & fieldset {
            border-color: rgba(255, 255, 255, 0.1);
        }
        
        &:hover fieldset {
            border-color: rgba(255, 255, 255, 0.2);
        }

        // Style for the select input
        select {
            color: #fff;
            background: transparent;

            // Style for the options
            option {
                background: #1a1a2e;
                color: #fff;
                padding: 12px;
                &:hover {
                    background: #2a2a4e;
                }
            }
        }
    }
    
    .MuiInputLabel-root {
        color: rgba(255, 255, 255, 0.7);
    }
    
    .MuiOutlinedInput-input {
        color: #fff;
    }

    // Style for the select dropdown
    .MuiSelect-select {
        color: #fff;
    }

    // Style for placeholder option
    select option[value=""] {
        color: rgba(255, 255, 255, 0.5);
    }
`;

const StyledButton = styled(MuiButton)`
    && {
        background: linear-gradient(135deg, #4a90e2 0%, #8f9aff 100%);
        border-radius: 12px;
        padding: 12px;
        font-size: 1.1rem;
        font-family: 'Rajdhani', sans-serif;
        text-transform: none;
        font-weight: 600;
        min-height: 48px;
        
        &:disabled {
            background: rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.3);
        }
        
        &:hover:not(:disabled) {
            background: linear-gradient(135deg, #5a9ff2 0%, #9faaff 100%);
        }
    }
`;

const StyledLink = styled(Link)`
    color:rgb(48, 73, 198);
    text-align: center;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    font-family: 'Rajdhani', sans-serif;
    transition: color 0.3s ease;

    &:hover {
        color:rgb(77, 117, 157);
    }
`;

export default Register;
