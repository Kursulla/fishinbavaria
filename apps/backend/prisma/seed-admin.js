const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const username = process.env.SEED_ADMIN_USERNAME?.trim();
    const password = process.env.SEED_ADMIN_PASSWORD?.trim();
    const firstName = process.env.SEED_ADMIN_FIRST_NAME?.trim() || "Admin";
    const lastName = process.env.SEED_ADMIN_LAST_NAME?.trim() || "User";

    if (!username || !password) {
        throw new Error("Missing SEED_ADMIN_USERNAME or SEED_ADMIN_PASSWORD.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { username },
        update: {
            firstName,
            lastName,
            passwordHash,
            role: "ADMIN",
            isActive: true,
        },
        create: {
            username,
            firstName,
            lastName,
            passwordHash,
            role: "ADMIN",
            isActive: true,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
