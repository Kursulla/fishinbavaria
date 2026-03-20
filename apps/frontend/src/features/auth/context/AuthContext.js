import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        let isMounted = true;

        authApi
            .getCurrentUser()
            .then((user) => {
                if (isMounted) {
                    setCurrentUser(user);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsBootstrapping(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    async function login(credentials) {
        const user = await authApi.login(credentials);
        setCurrentUser(user);
        return user;
    }

    async function logout() {
        await authApi.logout();
        setCurrentUser(null);
    }

    async function refreshCurrentUser() {
        const user = await authApi.getCurrentUser();
        setCurrentUser(user);
        return user;
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: Boolean(currentUser),
                isBootstrapping,
                login,
                logout,
                refreshCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider.");
    }

    return context;
}
