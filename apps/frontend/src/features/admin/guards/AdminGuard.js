import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

export default function AdminGuard({ children }) {
    const { currentUser, isBootstrapping } = useAuth();

    if (isBootstrapping) {
        return <div className="page-state">Učitavanje...</div>;
    }

    if (!currentUser || currentUser.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
}
