// src/pages/SchoolPortal.js

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Launch, School } from '@mui/icons-material';

const SchoolPortal = () => {
  const handlePortalClick = () => {
    window.open('https://www.myportal.fud.edu.ng/', '_blank');
  };

  return (
    <Container>
      <BackgroundAnimation />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header>
          <School sx={{ fontSize: 40, color: '#63f5ef' }} />
          <Title>FUD School Portal</Title>
          <Subtitle>Access your academic information and resources</Subtitle>
        </Header>

        <PortalCard
          onClick={handlePortalClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Launch sx={{ fontSize: 30, color: '#63f5ef' }} />
          <PortalText>Open FUD Portal</PortalText>
        </PortalCard>

        <InfoText>Click to access the official FUD student portal</InfoText>
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
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  color: #fff;
  font-size: 2.5rem;
  margin: 20px 0 0;
  background: linear-gradient(to right, #4a90e2, #63f5ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin: 10px 0 0;
`;

const PortalCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 20px 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const PortalText = styled.h2`
  font-family: 'Rajdhani', sans-serif;
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
`;

const InfoText = styled.p`
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 10px 0 0;
`;

export default SchoolPortal;
