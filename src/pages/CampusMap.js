import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CampusMap = () => {
    // Move useEffect inside the component
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });
    }, []);

    // FUD coordinates
    const campusCenter = [11.8061, 9.3364]; // Federal University Dutse coordinates
    
    const campusLocations = [
        {
            position: [11.8061, 9.3364],
            name: 'Main Campus',
            description: 'Federal University Dutse Main Campus'
        },
        {
            position: [11.8065, 9.3370],
            name: 'Faculty of Computing',
            description: 'Faculty of Computing and Information Sciences'
        },
        {
            position: [11.8058, 9.3360],
            name: 'University Library',
            description: 'Central Library'
        },
        {
            position: [11.8063, 9.3368],
            name: 'Student Center',
            description: 'Student Activities and Recreation'
        }
    ];

    return (
        <PageContainer>
            <Header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Title>FUD Campus Map</Title>
                <Subtitle>Navigate Federal University Dutse with ease</Subtitle>
            </Header>
            
            <MapWrapper
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <StyledMap 
                    center={campusCenter} 
                    zoom={17} 
                    scrollWheelZoom={true}
                    style={{ height: '600px', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {campusLocations.map((location, index) => (
                        <Marker 
                            key={index} 
                            position={location.position}
                        >
                            <Popup>
                                <PopupContent>
                                    <h3>{location.name}</h3>
                                    <p>{location.description}</p>
                                </PopupContent>
                            </Popup>
                        </Marker>
                    ))}
                </StyledMap>
            </MapWrapper>

            <Legend>
                <LegendTitle>Campus Locations</LegendTitle>
                {campusLocations.map((location, index) => (
                    <LegendItem key={index}>
                        <LegendIcon>📍</LegendIcon>
                        <LegendText>{location.name}</LegendText>
                    </LegendItem>
                ))}
            </Legend>
        </PageContainer>
    );
};

const PageContainer = styled.div`
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Header = styled(motion.div)`
    text-align: center;
    color: white;
    padding: 20px;
`;

const Title = styled.h1`
    font-family: 'Orbitron', sans-serif;
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(to right, #4a90e2, #63f5ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 10px 0 0 0;
`;

const MapWrapper = styled(motion.div)`
    flex: 1;
    min-height: 500px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const StyledMap = styled(MapContainer)`
    height: 600px !important;
    width: 100% !important;
    border-radius: 12px;
    z-index: 1;
`;

const PopupContent = styled.div`
    h3 {
        margin: 0 0 8px 0;
        color: #1a1a2e;
        font-family: 'Rajdhani', sans-serif;
    }
    
    p {
        margin: 0;
        color: #333;
    }
`;

const Legend = styled.div`
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
    backdrop-filter: blur(10px);
`;

const LegendTitle = styled.h3`
    color: #63f5ef;
    margin: 0 0 16px 0;
    font-family: 'Rajdhani', sans-serif;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0;
    color: white;
`;

const LegendIcon = styled.span`
    margin-right: 8px;
`;

const LegendText = styled.span`
    font-family: 'Rajdhani', sans-serif;
`;

export default CampusMap;
