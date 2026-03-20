const { env } = require("../../../app/config/env");
const { verifyAuthToken } = require("../../../infra/auth/tokenService");
const { findUserById, mapUser } = require("../../users/repositories/userRepository");

async function attachCurrentUser(request, _response, next) {
    const token = request.signedCookies?.[env.cookieName];

    if (!token) {
        request.currentUser = null;
        next();
        return;
    }

    try {
        const payload = verifyAuthToken(token);
        const user = await findUserById(payload.sub);

        if (!user || !user.isActive) {
            request.currentUser = null;
            next();
            return;
        }

        request.currentUser = mapUser(user);
        next();
    } catch (_error) {
        request.currentUser = null;
        next();
    }
}

module.exports = {
    attachCurrentUser,
};
