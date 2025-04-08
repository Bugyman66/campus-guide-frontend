import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Map, Home, School, Web, 
    SmartToy, Chat, Logout, ArrowBack, ArrowForward, Notifications 
} from '@mui/icons-material';

const Dashboard = () => {
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };
    const goToMap = () => {
        navigate('/campus-map');
    };  
    const [user, setUser] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [notifications] = useState([
        {
            id: 1,
            title: "Campus Event",
            message: "Annual Cultural Festival next week",
            date: "2024-03-28"
        },
        {
            id: 2,
            title: "Academic Notice",
            message: "Mid-semester examinations schedule released",
            date: "2024-03-27"
        }
    ]);

    const slides = [
        {
            image: "/images/campus1.jpg",
            title: "New Library Opening"
        },
        {
            image: "/images/campus2.jpg",
            title: "Sports Complex"
        }
    ];

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const menuItems = [
        { icon: <Map />, title: 'Campus Navigation', path: '/campus-map' },
        { icon: <Home />, title: 'Book Accommodation', path: '/accommodations' },
        { icon: <School />, title: 'School Portal', path: '/school-portal' },
        { icon: <SmartToy />, title: 'AI Assistant', path: '/ai-assistant' },
        { icon: <Chat />, title: 'Community Chat', path: '/chat' },
        {icon:<Web/>, title: 'VTU Portal', path: '/vtu-portal' }, 
    ];

    return (
        <Container>
            <BackgroundAnimation />
            <DashboardCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Header>
                    <WelcomeText
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Welcome back
                    </WelcomeText>
                    {user && (
                        <UserInfo>
                            <UserName>{user.name}</UserName>
                            <UserDetails>
                                <DetailItem>{user.regNo}</DetailItem>
                                <DetailItem>{user.faculty}</DetailItem>
                                <DetailItem>{user.department}</DetailItem>
                            </UserDetails>
                        </UserInfo>
                    )}
                </Header>

                <ContentSection>
                    <Slideshow>
                        <SlideContainer>
                            {slides.map((slide, index) => (
                                <Slide
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: index === currentSlide ? 1 : 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ display: index === currentSlide ? 'block' : 'none' }}
                                >
                                    <SlideImage src={slide.image} alt={slide.title} />
                                    <SlideCaption>{slide.title}</SlideCaption>
                                </Slide>
                            ))}
                        </SlideContainer>
                        <SlideControls>
                            <SlideButton
                                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ArrowBack />
                            </SlideButton>
                            <SlideButton
                                onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ArrowForward />
                            </SlideButton>
                        </SlideControls>
                    </Slideshow>
                    <NotificationBoard>
                        <NotificationHeader>
                            <Notifications sx={{ color: '#63f5ef' }} />
                            <h3>Announcements</h3>
                        </NotificationHeader>
                        <NotificationList>
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <NotificationTitle>{notification.title}</NotificationTitle>
                                    <NotificationMessage>{notification.message}</NotificationMessage>
                                    <NotificationDate>{notification.date}</NotificationDate>
                                </NotificationItem>
                            ))}
                        </NotificationList>
                    </NotificationBoard>
                </ContentSection>

                <MenuGrid>
                    {menuItems.map((item, index) => (
                        <MenuItem
                        
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <IconWrapper>{item.icon}</IconWrapper>
                            <MenuTitle>{item.title}</MenuTitle>
                        </MenuItem>
                    ))}
                </MenuGrid>

                <LogoutButton
                    onClick={() => {
                        localStorage.removeItem('user');
                        navigate('/login');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Logout /> Logout
                </LogoutButton>
            </DashboardCard>
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
    background: radial-gradient(circle at center, #2a2a4e 0%, transparent 70%);
    opacity: 0.5;
    animation: pulse 4s ease-in-out infinite;

    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.5; }
    }
`;

const DashboardCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 1200px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 1;
`;

const Header = styled.div`
    margin-bottom: 40px;
`;

const WelcomeText = styled(motion.h1)`
    font-family: 'Orbitron', sans-serif;
    color: #fff;
    font-size: 2.5rem;
    margin-bottom: 16px;
    background: linear-gradient(to right, #4a90e2, #63f5ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const UserInfo = styled.div`
    margin-top: 16px;
`;

const UserName = styled.h2`
    font-family: 'Rajdhani', sans-serif;
    color: #fff;
    font-size: 1.8rem;
    margin-bottom: 8px;
`;

const UserDetails = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`;

const DetailItem = styled.span`
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 16px;
    border-radius: 20px;
    color: #63f5ef;
    font-family: 'Rajdhani', sans-serif;
`;

const ContentSection = styled.div`
    margin-bottom: 40px;
`;

const Slideshow = styled.div`
    position: relative;
    margin-bottom: 40px;
`;

const SlideContainer = styled.div`
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 16px;
`;

const Slide = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
`;

const SlideImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
`;

const SlideCaption = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.5rem;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 16px;
    border-radius: 8px;
`;

const SlideControls = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
`;

const SlideButton = styled(motion.button)`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    padding: 8px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

const NotificationBoard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    padding: 24px;
    border-radius: 16px;
`;

const NotificationHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
`;

const NotificationList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const NotificationItem = styled(motion.div)`
    background: rgba(255, 255, 255, 0.1);
    padding: 16px;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

const NotificationTitle = styled.h4`
    color: #63f5ef;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    margin: 0;
`;

const NotificationMessage = styled.p`
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    margin: 8px 0 0;
`;

const NotificationDate = styled.span`
    color: #63f5ef;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.9rem;
`;

const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-top: 32px;
`;

const MenuItem = styled(motion.div)`
    background: rgba(255, 255, 255, 0.1);
    padding: 24px;
    border-radius: 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

const IconWrapper = styled.div`
    color: #63f5ef;
    font-size: 2rem;
    svg {
        width: 40px;
        height: 40px;
    }
`;

const MenuTitle = styled.h3`
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    margin: 0;
`;

const LogoutButton = styled(motion.button)`
    background: rgba(255, 59, 48, 0.2);
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    color: #ff3b30;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 59, 48, 0.3);
    }
`;

export default Dashboard;