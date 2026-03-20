const { prisma } = require("../../../infra/db/prismaClient");

function mapUser(user) {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
}

async function findUserByUsername(username) {
    return prisma.user.findUnique({
        where: { username },
    });
}

async function findUserById(id) {
    return prisma.user.findUnique({
        where: { id },
    });
}

async function listUsers() {
    const users = await prisma.user.findMany({
        orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    });

    return users.map(mapUser);
}

async function createUser(data) {
    const user = await prisma.user.create({
        data,
    });

    return mapUser(user);
}

async function updateUser(id, data) {
    const user = await prisma.user.update({
        where: { id },
        data,
    });

    return mapUser(user);
}

async function deleteUser(id) {
    return prisma.user.delete({
        where: { id },
    });
}

module.exports = {
    createUser,
    deleteUser,
    findUserById,
    findUserByUsername,
    listUsers,
    mapUser,
    updateUser,
};
