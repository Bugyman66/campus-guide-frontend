import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Accommodations from "./pages/Accommodations";
import PaymentSuccess from "./pages/PaymentSuccess";
import SplashScreen from "./pages/SplashScreen";
import CampusMap from './pages/CampusMap';
import SchoolPortal from './pages/SchoolPortal';
import AIAssistant from './components/AIAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import CommunityChatPage from './pages/CommunityChat';
import CommunityChat from './pages/CommunityChat';
import Navigation from './pages/navigation';
import Vtuportal from './pages/Vtu';
import Assistance from './pages/Assistance';

function App() {
    return (
        <>
            <link 
                rel="stylesheet" 
                href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                crossorigin=""
            />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/accommodations"
                        element={
                            <ProtectedRoute>
                                <Accommodations />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/campus-map"
                        element={
                            <ProtectedRoute>
                                <CampusMap />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/school-portal"
                        element={
                            <ProtectedRoute>
                                <SchoolPortal />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ai-assistant"
                        element={
                            <ProtectedRoute>
                                <AIAssistant />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payment-success"
                        element={
                            <ProtectedRoute>
                                <PaymentSuccess />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/community-chat" 
                        element={
                            <ProtectedRoute>
                                 <CommunityChatPage />
                            </ProtectedRoute> 
                        }
                   />
                    <Route
                        path="/vtu-portal" 
                        element={
                            <ProtectedRoute>
                                 <Vtuportal />
                            </ProtectedRoute> 
                        }
                    />
                    <Route
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <CommunityChat />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/navigation" element={<Navigation />} />
                    <Route path="/assistance" element={<Assistance />} />
                    {/* Catch all route - redirect to dashboard if logged in, otherwise to login */}
                    <Route
                        path="*"
                        element={
                            <Navigate to={localStorage.getItem('token') ? '/dashboard' : '/login'} />
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;