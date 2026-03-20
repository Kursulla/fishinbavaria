const { env } = require("../../app/config/env");

function buildAuthCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
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
