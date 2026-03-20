const { env } = require("../../app/config/env");

function buildAuthCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        signed: true,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

function setAuthCookie(response, token) {
    response.cookie(env.cookieName, token, buildAuthCookieOptions());
}

function clearAuthCookie(response) {
    response.clearCookie(env.cookieName, buildAuthCookieOptions());
}

module.exports = {
    clearAuthCookie,
    setAuthCookie,
};
