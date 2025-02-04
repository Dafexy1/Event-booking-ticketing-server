import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { connectLogger } from "./utils/logger";
import apiRoute from "./routes/apiRoute";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(connectLogger());

// API Routes
app.use("/api", apiRoute);

export default app;