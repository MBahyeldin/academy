import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlewares/auth.js";
import { prisma } from "../prisma.js";
import { userRepo } from "../repositories/userRepo.js";

export const achievementsRouter = Router();

achievementsRouter.get("/", requireAuth, async (req, res) => {
  const { strapiId } = (req as AuthedRequest).auth;
  const user = await userRepo.upsertByStrapiId(strapiId);
  const rows = await prisma.achievement.findMany({
    where: { userId: user.id },
    orderBy: { awardedAt: "desc" },
  });
  res.json(
    rows.map((a) => ({
      id: a.id,
      userId: a.userId,
      type: a.type,
      awardedAt: a.awardedAt.toISOString(),
    })),
  );
});
