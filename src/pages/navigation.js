import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import marker icons directly
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up the default icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// FUD coordinates
const campusLocation = [11.2168, 9.3162];

const Navigation = () => {
    return (
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            position: 'relative',
            zIndex: 0 
        }}>
            <MapContainer 
                center={campusLocation} 
                zoom={16} 
                style={{ 
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    zIndex: 1
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={campusLocation}>
                    <Popup>
                        Federal University Dutse (FUD)
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Navigation;
