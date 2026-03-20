import { apiClient } from "../../../shared/api/apiClient";

async function listUsers() {
    const data = await apiClient.get("/api/users");
    return data.users;
}

async function createUser(payload) {
    const data = await apiClient.post("/api/users", payload);
    return data.user;
}

async function updateUser(userId, payload) {
    const data = await apiClient.patch(`/api/users/${userId}`, payload);
    return data.user;
}

async function deleteUser(userId) {
    await apiClient.remove(`/api/users/${userId}`);
}

export const usersApi = {
    createUser,
    deleteUser,
    listUsers,
    updateUser,
};
