const app = require("./app");
const { env } = require("./app/config/env");

app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
});
