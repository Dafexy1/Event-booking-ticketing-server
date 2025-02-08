"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSql = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const eventSchema_1 = require("../model/schemas/eventSchema");
const userSchema_1 = require("../model/schemas/userSchema");
const waitingListSchema_1 = require("../model/schemas/waitingListSchema");
const bookingSchema_1 = require("../model/schemas/bookingSchema");
dotenv_1.default.config();
// Initialize Sequelize instance
exports.sequelize = new sequelize_1.Sequelize(process.env.PG_DATABASE, process.env.PG_USERNAME, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: process.env.DB_LOGGING === "true",
});
const connectSql = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        console.log("PostgreSQL connected with Sequelize");
        // Initialize models
        (0, eventSchema_1.initializeEventModel)(exports.sequelize);
        (0, userSchema_1.initializeUserModel)(exports.sequelize);
        (0, bookingSchema_1.initializeBookingModel)(exports.sequelize);
        (0, waitingListSchema_1.initializeWaitingListModel)(exports.sequelize);
        // Sync database
        yield exports.sequelize.sync({ alter: true });
        console.log("Database synced successfully");
    }
    catch (error) {
        console.error("Unable to connect to PostgreSQL:", error);
    }
});
exports.connectSql = connectSql;
// export const connectSql = async () => {
//   const sqLUri = new Sequelize(
//     process.env.PG_DATABASE as string,        
//     process.env.PG_USERNAME as string,        
//     process.env.PG_PASSWORD as string,    
//     {
//       host: process.env.PG_HOST,          
//       dialect: 'postgres',               
//       logging: process.env.DB_LOGGING === 'true',
//     }
//   );
//   try {
//     await sqLUri.authenticate();
//     console.log('PostgreSQL connected with Sequelize');
//     initializeEventModel(sqLUri);
//     initializeUserModel(sqLUri);
//     initializeBookingModel(sqLUri);
//     initializeWaitingListModel(sqLUri);
//     await sqLUri.sync({alter: true});
//     console.log('Database synced success');
//   } catch (error) {
//     console.error('Unable to connect to PostgreSQL:', error);
//   }
// };
// export default connectSql;
