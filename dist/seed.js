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
const eventSchema_1 = require("./model/schemas/eventSchema");
const userSchema_1 = require("./model/schemas/userSchema");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Seed events
        const events = [
            {
                name: "Tech Conference 2025",
                totalTickets: 100,
                availableTickets: 100,
            },
            {
                name: "Music Fest 2025",
                totalTickets: 200,
                availableTickets: 200,
            },
            {
                name: "Art Gala 2025",
                totalTickets: 50,
                availableTickets: 50,
            },
        ];
        for (const event of events) {
            yield eventSchema_1.Event.create(event);
        }
        console.log("Events added successfully.");
        // Seed users
        const users = [
            { email: "user1@example.com" },
            { email: "user2@example.com" },
            { email: "user3@example.com" },
            { email: "user4@example.com" },
            { email: "user5@example.com" },
            { email: "user6@example.com" },
            { email: "user7@example.com" },
            { email: "user8@example.com" },
            { email: "user9@example.com" },
            { email: "user10@example.com" },
        ];
        for (const user of users) {
            yield userSchema_1.User.create(user);
        }
        console.log("Users added successfully.");
    }
    catch (error) {
        console.error("Error seeding data:", error);
    }
}))();
