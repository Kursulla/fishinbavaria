const jwt = require("jsonwebtoken");
const { env } = require("../../app/config/env");

function signAuthToken(payload) {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: "7d",
    });
}

function verifyAuthToken(token) {
    return jwt.verify(token, env.jwtSecret);
}

module.exports = {
    signAuthToken,
    verifyAuthToken,
};
