import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import { connectLogger } from "./utils/logger";
import apiRoute from "./routes/apiRoute";
import { limiter } from './middleware/rateLimtter';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(connectLogger());
app.use(bodyParser.json());

// API Routes
app.use("/api", limiter, apiRoute);

export default app;