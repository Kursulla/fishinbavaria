const express = require("express");
const { requireAuth } = require("../../auth/http/requireAuth");
const { requireAdmin } = require("../../admin/http/requireAdmin");
const { createUser, deleteUser, listUsers, updateUser } = require("../services/userService");

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", async (_request, response, next) => {
    try {
        const users = await listUsers();
        response.json({ users });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (request, response, next) => {
    try {
        const user = await createUser(request.body || {});
        response.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

router.patch("/:userId", async (request, response, next) => {
    try {
        if (request.currentUser.id === request.params.userId && request.body?.isActive === false) {
            const error = new Error("Ne možete deaktivirati sopstveni nalog.");
            error.statusCode = 400;
            throw error;
        }

        const user = await updateUser(request.params.userId, request.body || {});
        response.json({ user });
    } catch (error) {
        next(error);
    }
});

router.delete("/:userId", async (request, response, next) => {
    try {
        if (request.currentUser.id === request.params.userId) {
            const error = new Error("Ne možete obrisati sopstveni nalog.");
            error.statusCode = 400;
            throw error;
        }

        await deleteUser(request.params.userId);
        response.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
