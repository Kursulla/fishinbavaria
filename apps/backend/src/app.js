const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { env } = require("./app/config/env");
const { attachCurrentUser } = require("./features/auth/http/attachCurrentUser");
const authRoutes = require("./features/auth/routes/authRoutes");
const userRoutes = require("./features/users/routes/userRoutes");
const aiRoutes = require("./features/ai/routes/aiRoutes");

const openApiDocument = YAML.load(path.join(__dirname, "docs/openapi/openapi.yaml"));
const app = express();

app.use(
    cors({
        origin: env.frontendOrigin,
        credentials: true,
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(env.cookieSecret));
app.use(attachCurrentUser);

app.get("/health", (_request, response) => {
    response.json({ ok: true });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.use((error, _request, response, _next) => {
    const status = error.statusCode || 500;
    response.status(status).json({
        message: error.message || "Internal server error.",
    });
});

module.exports = app;
