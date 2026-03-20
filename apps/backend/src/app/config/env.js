const dotenv = require("dotenv");

dotenv.config();

function readRequired(name) {
    const value = process.env[name];
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value.trim();
}

const env = {
    databaseUrl: readRequired("DATABASE_URL"),
    jwtSecret: readRequired("JWT_SECRET"),
    cookieSecret: readRequired("COOKIE_SECRET"),
    cookieName: process.env.COOKIE_NAME?.trim() || "do_dozvole_session",
    frontendOrigin: process.env.FRONTEND_ORIGIN?.trim() || "http://localhost:3000",
    openRouterApiKey: process.env.OPENROUTER_API_KEY?.trim() || "",
    openRouterModel: process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4.1-mini",
    port: Number(process.env.PORT || 4000),
};

module.exports = {
    env,
};
