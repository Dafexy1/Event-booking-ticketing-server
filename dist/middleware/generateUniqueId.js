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
exports.generateAuthToken = exports.generateOTP = exports.generateTicketID = exports.generateTicketQueueId = void 0;
const nanoid_1 = require("nanoid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const generateTicketQueueId = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (len = 8) { return (0, nanoid_1.nanoid)(len); }); //=> "V1StGXR8_Z5jdHi6B-myT"
exports.generateTicketQueueId = generateTicketQueueId;
const generateTicketID = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (len = 6) { return (0, nanoid_1.nanoid)(len); }); //=> "V2StGXR8_Z5jdHi6B-&7G"
exports.generateTicketID = generateTicketID;
const generateOTP = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (len = 6) {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
});
exports.generateOTP = generateOTP;
const generateAuthToken = ({ id, _id, email }) => {
    var _a;
    return jsonwebtoken_1.default.sign({ id, _id, email }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '', {
    //    expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.generateAuthToken = generateAuthToken;
exports.default = exports.generateAuthToken;
