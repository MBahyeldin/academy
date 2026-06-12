import { z } from "zod";

export const StrapiLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export type StrapiLevel = z.infer<typeof StrapiLevelSchema>;

export const StrapiLessonTypeSchema = z.enum(["video", "reading", "quiz"]);
export type StrapiLessonType = z.infer<typeof StrapiLessonTypeSchema>;

export const StrapiCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable().optional(),
});
export type StrapiCategory = z.infer<typeof StrapiCategorySchema>;

export const StrapiInstructorSchema = z.object({
  id: z.number(),
  name: z.string(),
  bio: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  expertise: z.array(z.string()).optional().default([]),
});
export type StrapiInstructor = z.infer<typeof StrapiInstructorSchema>;

export const StrapiLessonSchema = z.object({
  id: z.number(),
  title: z.string(),
  order: z.number(),
  videoUrl: z.string().nullable().optional(),
  durationMinutes: z.number().nullable().optional(),
  type: StrapiLessonTypeSchema,
});
export type StrapiLesson = z.infer<typeof StrapiLessonSchema>;

export const StrapiModuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  order: z.number(),
  lessons: z.array(StrapiLessonSchema).optional().default([]),
});
export type StrapiModule = z.infer<typeof StrapiModuleSchema>;

export const StrapiReviewSchema = z.object({
  id: z.number(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  studentName: z.string(),
  createdAt: z.string(),
});
export type StrapiReview = z.infer<typeof StrapiReviewSchema>;
export const ImageUrlSchema = z.object({
  url: z.string(),
});
export const StrapiCourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  documentId: z.string().nullable().optional(),
  level: StrapiLevelSchema,
  price: z.number().nullable().optional(),
  thumbnail: ImageUrlSchema.nullable().optional(),
  category: StrapiCategorySchema.nullable().optional(),
  instructor: StrapiInstructorSchema.nullable().optional(),
  modules: z.array(StrapiModuleSchema).optional().default([]),
  reviews: z.array(StrapiReviewSchema).optional().default([]),
});
export type StrapiCourse = z.infer<typeof StrapiCourseSchema>;

export const StrapiUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  confirmed: z.boolean().optional(),
  blocked: z.boolean().optional(),
});
export type StrapiUser = z.infer<typeof StrapiUserSchema>;

export const StrapiAuthResponseSchema = z.object({
  jwt: z.string(),
  user: StrapiUserSchema,
});


export type StrapiAuthResponse = z.infer<typeof StrapiAuthResponseSchema>;
