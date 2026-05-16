import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlewares/auth.js";
import { userRepo } from "../repositories/userRepo.js";

export const authRouter = Router();

authRouter.post("/sync", requireAuth, async (req, res) => {
  const { strapiId } = (req as AuthedRequest).auth;
  const user = await userRepo.upsertByStrapiId(strapiId);
  res.json({ id: user.id, strapiId: user.strapiId, createdAt: user.createdAt });
});
