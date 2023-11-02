const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  users: prisma.users,
  profiles: prisma.profiles,
  address: prisma.address,
  movie: prisma.movie,
};
