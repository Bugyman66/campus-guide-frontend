// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">CampusConnect</h2>
      <ul className="space-y-4">
        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/accommodation" className="hover:underline">Accommodation</Link></li>
        <li><Link to="/school-portal" className="hover:underline">School Portal</Link></li>
        <li><Link to="/ai-assistant" className="hover:underline">AI Assistant</Link></li>
        <li><Link to="/community-chat" className="hover:underline">Community Chat</Link></li>
        <li><Link to="/logout" className="hover:underline">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
