function requireAuth(request, _response, next) {
    if (!request.currentUser) {
        const error = new Error("Morate biti ulogovani.");
        error.statusCode = 401;
        next(error);
        return;
    }

    next();
}

module.exports = {
    requireAuth,
};
