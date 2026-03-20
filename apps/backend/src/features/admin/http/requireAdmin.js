function requireAdmin(request, _response, next) {
    if (!request.currentUser) {
        const error = new Error("Morate biti ulogovani.");
        error.statusCode = 401;
        next(error);
        return;
    }

    if (request.currentUser.role !== "ADMIN") {
        const error = new Error("Nemate pristup ovoj ruti.");
        error.statusCode = 403;
        next(error);
        return;
    }

    next();
}

module.exports = {
    requireAdmin,
};
