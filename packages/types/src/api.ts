import { z } from "zod";

export const AchievementTypeSchema = z.enum([
  "first_lesson",
  "7_day_streak",
  "30_day_streak",
  "course_completed",
  "first_quiz",
]);
export type AchievementType = z.infer<typeof AchievementTypeSchema>;

export const NotificationTypeSchema = z.enum(["info", "success", "warning"]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const UserProgressSchema = z.object({
  userId: z.string(),
  courseId: z.number(),
  percentage: z.number().min(0).max(100),
  lastLessonId: z.number().nullable(),
  lastStudiedAt: z.string(),
});
export type UserProgress = z.infer<typeof UserProgressSchema>;

export const StudySessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.number(),
  durationMinutes: z.number(),
  date: z.string(),
});
export type StudySession = z.infer<typeof StudySessionSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: AchievementTypeSchema,
  awardedAt: z.string(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string(),
  type: NotificationTypeSchema,
  read: z.boolean(),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const DashboardDataSchema = z.object({
  progress: z.array(UserProgressSchema),
  studyHours: z.array(StudySessionSchema),
  achievements: z.array(AchievementSchema),
  notifications: z.array(NotificationSchema),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

export const JwtPayloadSchema = z.object({
  id: z.number(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const EnrollStubResponseSchema = z.object({
  status: z.literal("coming_soon"),
  message: z.string(),
});
export type EnrollStubResponse = z.infer<typeof EnrollStubResponseSchema>;
