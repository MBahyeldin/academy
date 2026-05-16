import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlewares/auth.js";
import { prisma } from "../prisma.js";
import { userRepo } from "../repositories/userRepo.js";

export const progressRouter = Router();

progressRouter.get("/", requireAuth, async (req, res) => {
  const { strapiId } = (req as AuthedRequest).auth;
  const user = await userRepo.upsertByStrapiId(strapiId);
  const rows = await prisma.progress.findMany({ where: { userId: user.id } });
  res.json(
    rows.map((p) => ({
      userId: p.userId,
      courseId: p.courseId,
      percentage: p.percentage,
      lastLessonId: p.lastLessonId,
      lastStudiedAt: p.lastStudiedAt.toISOString(),
    })),
  );
});

progressRouter.get("/:courseId", requireAuth, async (req, res) => {
  const { strapiId } = (req as AuthedRequest).auth;
  const courseId = Number(req.params.courseId);
  if (Number.isNaN(courseId)) return res.status(400).json({ error: "Invalid courseId" });
  const user = await userRepo.upsertByStrapiId(strapiId);
  const row = await prisma.progress.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  if (!row) return res.json(null);
  res.json({
    userId: row.userId,
    courseId: row.courseId,
    percentage: row.percentage,
    lastLessonId: row.lastLessonId,
    lastStudiedAt: row.lastStudiedAt.toISOString(),
  });
});
