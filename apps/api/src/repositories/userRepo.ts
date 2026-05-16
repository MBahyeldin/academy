import { prisma } from "../prisma.js";

export const userRepo = {
  upsertByStrapiId(strapiId: number) {
    return prisma.user.upsert({
      where: { strapiId },
      update: {},
      create: { strapiId },
    });
  },
  findByStrapiId(strapiId: number) {
    return prisma.user.findUnique({ where: { strapiId } });
  },
};
