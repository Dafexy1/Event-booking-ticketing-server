import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';

// Rate limiter to control requests from clients
export const limiter = rateLimit({
  windowMs: 3 * 1000, // 5 seconds
  // windowMs: 0.2 * 60 * 1000, // 30 seconds
  max: 3, // Max requests per IP within the window
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      message: {
        error: "Too many requests, please try again later.",
      },
    });
  },
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  return limiter(req, res, next);
};



