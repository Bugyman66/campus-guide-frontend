import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const CampusMap = () => {
    // Example coordinates for your campus - replace with actual coordinates
    const campusCenter = [9.0820, 8.6753]; // Nigeria coordinates
    const campusLocations = [
        {
            position: [9.0820, 8.6753],
            name: 'Main Building',
            description: 'Administrative headquarters'
        },
        // Add more campus locations as needed
    ];

    return (
        <PageContainer>
            <Header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Title>Campus Map</Title>
                <Subtitle>Find your way around the campus with ease</Subtitle>
            </Header>
            
            <MapWrapper
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <StyledMap center={campusCenter} zoom={16} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {campusLocations.map((location, index) => (
                        <Marker key={index} position={location.position}>
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

const StyledMap = styled(LeafletMap)`
    height: 100%;
    width: 100%;
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

export default CampusMap;
