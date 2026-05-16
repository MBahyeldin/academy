import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlewares/auth.js";
import { prisma } from "../prisma.js";
import { userRepo } from "../repositories/userRepo.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", requireAuth, async (req, res) => {
  const { strapiId } = (req as AuthedRequest).auth;
  const user = await userRepo.upsertByStrapiId(strapiId);
  const rows = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    rows.map((n) => ({
      id: n.id,
      userId: n.userId,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
  );
});
