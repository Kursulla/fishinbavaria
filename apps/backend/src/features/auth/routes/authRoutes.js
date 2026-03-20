const express = require("express");
const { login, logout } = require("../services/authService");
const { requireAuth } = require("../http/requireAuth");

const router = express.Router();

router.post("/login", async (request, response, next) => {
    try {
        const { username = "", password = "" } = request.body || {};
        const user = await login(response, username.trim(), password);

        response.json({ user });
    } catch (error) {
        next(error);
    }
});

router.post("/logout", (request, response) => {
    logout(response);
    response.status(204).send();
});

router.get("/me", requireAuth, (request, response) => {
    response.json({ user: request.currentUser });
});

module.exports = router;
