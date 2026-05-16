import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STRAPI_USER_ID = 1; // demo student in Strapi (created by apps/cms seed)

async function main() {
  const user = await prisma.user.upsert({
    where: { strapiId: STRAPI_USER_ID },
    update: {},
    create: { strapiId: STRAPI_USER_ID },
  });
  console.log(`[seed] user uuid=${user.id} strapiId=${user.strapiId}`);

  await prisma.enrollment.deleteMany({ where: { userId: user.id } });
  await prisma.progress.deleteMany({ where: { userId: user.id } });
  await prisma.studySession.deleteMany({ where: { userId: user.id } });
  await prisma.achievement.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });

  // Strapi course IDs 1 (Tajweed) and 2 (Usool Al-Fiqh)
  await prisma.enrollment.createMany({
    data: [
      { userId: user.id, courseId: 1 },
      { userId: user.id, courseId: 2 },
    ],
  });

  await prisma.progress.createMany({
    data: [
      { userId: user.id, courseId: 1, percentage: 75, lastLessonId: 9 },
      { userId: user.id, courseId: 2, percentage: 30, lastLessonId: 4 },
    ],
  });

  const sessions: { userId: string; courseId: number; durationMinutes: number; date: Date }[] = [];
  const now = Date.now();
  for (let i = 0; i < 8; i++) {
    sessions.push({
      userId: user.id,
      courseId: 1,
      durationMinutes: 25 + (i % 3) * 10,
      date: new Date(now - i * 3 * 24 * 60 * 60 * 1000),
    });
  }
  for (let i = 0; i < 3; i++) {
    sessions.push({
      userId: user.id,
      courseId: 2,
      durationMinutes: 30,
      date: new Date(now - (i + 1) * 5 * 24 * 60 * 60 * 1000),
    });
  }
  await prisma.studySession.createMany({ data: sessions });

  await prisma.achievement.createMany({
    data: [
      {
        userId: user.id,
        type: "first_lesson",
        awardedAt: new Date(now - 29 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        type: "7_day_streak",
        awardedAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: user.id, message: "Your next Tajweed lesson starts Sunday at 8:00 PM", type: "info" },
      { userId: user.id, message: "New lesson added to Usool Al-Fiqh", type: "info" },
      { userId: user.id, message: "You've completed Module 2 of Tajweed!", type: "success" },
      { userId: user.id, message: "Sheikh Abdullah posted a new Q&A session", type: "info" },
      { userId: user.id, message: "Reminder: You haven't studied in 3 days", type: "warning" },
    ],
  });

  console.log("[seed] Done. 2 enrollments, 2 progress, 11 sessions, 2 achievements, 5 notifications.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
