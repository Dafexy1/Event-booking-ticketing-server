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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = exports.limiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
// Rate limiter to control requests from clients
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 3 * 1000, // 5 seconds
    // windowMs: 0.2 * 60 * 1000, // 30 seconds
    max: 3, // Max requests per IP within the window
    handler: (req, res) => {
        res.status(429).json({
            message: {
                error: "Too many requests, please try again later.",
            },
        });
    },
});
const rateLimiterMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.limiter)(req, res, next);
});
exports.rateLimiterMiddleware = rateLimiterMiddleware;
