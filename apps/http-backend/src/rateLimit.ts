import rateLimit from "express-rate-limit";
// Strict limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // max 10 attempts per window
  message: { message: "Too many attempts, try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});