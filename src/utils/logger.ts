import { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

export const connectLogger = () => (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
};

export default logger;
