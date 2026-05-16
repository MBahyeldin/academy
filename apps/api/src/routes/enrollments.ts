import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";

export const enrollmentsRouter = Router();

// Stubbed — payment integration is out of scope for sprint 1.
enrollmentsRouter.post("/", requireAuth, (_req, res) => {
  res.json({
    status: "coming_soon",
    message: "Enrollment launching soon. Check back next sprint!",
  });
});
