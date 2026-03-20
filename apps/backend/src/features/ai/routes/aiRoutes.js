const express = require("express");
const { requireAuth } = require("../../auth/http/requireAuth");
const { explainQuestion } = require("../services/aiService");

const router = express.Router();

router.use(requireAuth);

router.post("/explain", async (request, response, next) => {
    try {
        const explanation = await explainQuestion(request.body || {});
        response.json(explanation);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
