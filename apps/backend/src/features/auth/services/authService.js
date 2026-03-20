const { setAuthCookie, clearAuthCookie } = require("../../../infra/auth/authCookie");
const { signAuthToken } = require("../../../infra/auth/tokenService");
const { verifyPassword } = require("../../../infra/crypto/passwordHasher");
const { findUserByUsername, mapUser } = require("../../users/repositories/userRepository");

async function login(response, username, password) {
    const user = await findUserByUsername(username);

    if (!user || !user.isActive) {
        const error = new Error("Pogrešno korisničko ime ili lozinka.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
        const error = new Error("Pogrešno korisničko ime ili lozinka.");
        error.statusCode = 401;
        throw error;
    }

    const token = signAuthToken({
        sub: user.id,
        role: user.role,
    });

    setAuthCookie(response, token);

    return mapUser(user);
}

function logout(response) {
    clearAuthCookie(response);
}

module.exports = {
    login,
    logout,
};
