const { hashPassword } = require("../../../infra/crypto/passwordHasher");
const {
    createUser: createUserRecord,
    deleteUser: deleteUserRecord,
    findUserByUsername,
    listUsers: listUserRecords,
    updateUser: updateUserRecord,
} = require("../repositories/userRepository");

function normalizeRole(role) {
    return role === "ADMIN" ? "ADMIN" : "USER";
}

function assertRequiredString(value, fieldName) {
    if (!value || !String(value).trim()) {
        const error = new Error(`Polje ${fieldName} je obavezno.`);
        error.statusCode = 400;
        throw error;
    }

    return String(value).trim();
}

async function listUsers() {
    return listUserRecords();
}

async function createUser(payload) {
    const username = assertRequiredString(payload.username, "username");
    const firstName = assertRequiredString(payload.firstName, "firstName");
    const lastName = assertRequiredString(payload.lastName, "lastName");
    const password = assertRequiredString(payload.password, "password");

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        const error = new Error("Korisničko ime već postoji.");
        error.statusCode = 409;
        throw error;
    }

    return createUserRecord({
        username,
        firstName,
        lastName,
        passwordHash: await hashPassword(password),
        role: normalizeRole(payload.role),
        isActive: payload.isActive !== false,
    });
}

async function updateUser(userId, payload) {
    const data = {};

    if (payload.firstName !== undefined) {
        data.firstName = assertRequiredString(payload.firstName, "firstName");
    }

    if (payload.lastName !== undefined) {
        data.lastName = assertRequiredString(payload.lastName, "lastName");
    }

    if (payload.role !== undefined) {
        data.role = normalizeRole(payload.role);
    }

    if (payload.isActive !== undefined) {
        data.isActive = Boolean(payload.isActive);
    }

    if (payload.password) {
        data.passwordHash = await hashPassword(payload.password);
    }

    return updateUserRecord(userId, data);
}

async function deleteUser(userId) {
    return deleteUserRecord(userId);
}

module.exports = {
    createUser,
    deleteUser,
    listUsers,
    updateUser,
};
