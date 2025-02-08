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
exports.ticketPurchaseConcurrencyHandler = void 0;
const eventSchema_1 = require("../model/schemas/eventSchema");
const sequelize_1 = require("../database/sequelize");
/**
 * Middleware to handle concurrent ticket purchases.
 */
const ticketPurchaseConcurrencyHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, ticketsToPurchase } = req.body;
    if (!eventId || !ticketsToPurchase) {
        return res.status(400).json({ message: "Event ID and ticketsToPurchase are required." });
    }
    try {
        // Use a transaction to ensure atomicity
        const transaction = yield sequelize_1.sequelize.transaction;
        try {
            // Lock the event row for updates (to prevent concurrent changes)
            const event = yield eventSchema_1.Event.findOne({
                where: { id: eventId },
                lock: transaction.LOCK.UPDATE, // Locks the row until the transaction is complete
                transaction,
            });
            if (!event) {
                yield transaction.rollback();
                return res.status(404).json({ message: "Event not found." });
            }
            // Check if there are enough tickets available
            if (event.availableTickets < ticketsToPurchase) {
                yield transaction.rollback();
                return res.status(400).json({
                    message: `Not enough tickets available. Only ${event.availableTickets} tickets left.`,
                });
            }
            // Deduct the tickets from availableTickets
            event.availableTickets -= ticketsToPurchase;
            yield event.save({ transaction });
            // Commit the transaction
            yield transaction.commit();
            next(); // Pass to the next middleware or controller
        }
        catch (error) {
            // Rollback the transaction if anything goes wrong
            yield transaction.rollback();
            throw error;
        }
    }
    catch (error) {
        console.error("Error handling concurrency:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.ticketPurchaseConcurrencyHandler = ticketPurchaseConcurrencyHandler;
