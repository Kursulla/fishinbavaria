import { apiClient } from "../../../shared/api/apiClient";

async function login(credentials) {
    const data = await apiClient.post("/api/auth/login", credentials);
    return data.user;
}

async function logout() {
    await apiClient.post("/api/auth/logout", {});
}

async function getCurrentUser() {
    try {
        const data = await apiClient.get("/api/auth/me");
        return data.user;
    } catch (error) {
        if (error.status === 401) {
            return null;
        }

        throw error;
    }
}

export const authApi = {
    getCurrentUser,
    login,
    logout,
};
