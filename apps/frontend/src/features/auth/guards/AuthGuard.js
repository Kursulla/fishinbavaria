import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children }) {
    const location = useLocation();
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) {
        return <div className="page-state">Učitavanje...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
