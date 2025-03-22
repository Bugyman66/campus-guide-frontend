import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
    return getUser() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
