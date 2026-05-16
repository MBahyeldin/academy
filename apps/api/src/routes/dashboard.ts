import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middlewares/auth.js";
import { prisma } from "../prisma.js";
import { userRepo } from "../repositories/userRepo.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, async (req, res) => {
  const { strapiId } = (req as AuthedRequest).auth;
  const user = await userRepo.upsertByStrapiId(strapiId);

  const [progress, studyHours, achievements, notifications] = await Promise.all([
    prisma.progress.findMany({ where: { userId: user.id }, orderBy: { lastStudiedAt: "desc" } }),
    prisma.studySession.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 90,
    }),
    prisma.achievement.findMany({ where: { userId: user.id }, orderBy: { awardedAt: "desc" } }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  res.json({
    progress: progress.map((p) => ({
      userId: p.userId,
      courseId: p.courseId,
      percentage: p.percentage,
      lastLessonId: p.lastLessonId,
      lastStudiedAt: p.lastStudiedAt.toISOString(),
    })),
    studyHours: studyHours.map((s) => ({
      id: s.id,
      userId: s.userId,
      courseId: s.courseId,
      durationMinutes: s.durationMinutes,
      date: s.date.toISOString(),
    })),
    achievements: achievements.map((a) => ({
      id: a.id,
      userId: a.userId,
      type: a.type,
      awardedAt: a.awardedAt.toISOString(),
    })),
    notifications: notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
  });
});
