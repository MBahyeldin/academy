import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { progressRouter } from "./routes/progress.js";
import { notificationsRouter } from "./routes/notifications.js";
import { achievementsRouter } from "./routes/achievements.js";
import { enrollmentsRouter } from "./routes/enrollments.js";
import { errorHandler, notFound } from "./middlewares/error.js";

export function createApp() {
  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true, service: "@academy/api" }));

  app.use("/api/auth", authRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/progress", progressRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/achievements", achievementsRouter);
  app.use("/api/enrollments", enrollmentsRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
