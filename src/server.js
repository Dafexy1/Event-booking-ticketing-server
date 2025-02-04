"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const eventCore_1 = __importDefault(require("./eventCore"));
// import connectDB from "./database/database";
const sequelize_1 = __importDefault(require("./database/sequelize"));
// connectDB()
(0, sequelize_1.default)();
const PORT = parseInt(process.env.PORT || "5000", 10);
// Root route handler
eventCore_1.default.get('/', (req, res) => {
    res.send('Event-Booking server up and running');
});
eventCore_1.default.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
