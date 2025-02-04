import { Router } from "express";

const router: Router = Router();

// Placeholder Route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to SentinelAI API Gateway" });
});

export default router;