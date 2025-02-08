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
exports.getEventStatusController = exports.addTicketsToEventController = exports.cancelAndReassignController = exports.assignTicketsController = exports.getWaitingListController = exports.getAllEventsController = exports.createEventController = void 0;
const eventService_1 = require("../services/eventService");
const createEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, totalTickets, availableTickets } = req.body;
        if (!name || !totalTickets || !availableTickets) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const event = yield (0, eventService_1.createEvent)({ name, totalTickets, availableTickets });
        res.status(201).json({ message: "Event created successfully", event });
    }
    catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.createEventController = createEventController;
const getAllEventsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield (0, eventService_1.getAllEvents)();
        res.status(200).json({ events });
    }
    catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getAllEventsController = getAllEventsController;
const getWaitingListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const waitingList = yield (0, eventService_1.getWaitingListByEvent)(Number(eventId));
        if (waitingList.length === 0) {
            return res.status(404).json({ message: "No users found in the waiting list for this event." });
        }
        res.status(200).json({ waitingList });
    }
    catch (error) {
        console.error("Error fetching waiting list:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getWaitingListController = getWaitingListController;
const assignTicketsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { newTickets } = req.body;
    if (!eventId || !newTickets) {
        res.status(400).json({ message: "Event ID and newTickets are required" });
        return;
    }
    try {
        yield (0, eventService_1.assignTicketsFromWaitingList)(Number(eventId), Number(newTickets));
        res.status(200).json({ message: "Tickets assigned successfully from waiting List" });
    }
    catch (error) {
        console.error("Error assigning tickets from waiting list:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.assignTicketsController = assignTicketsController;
const cancelAndReassignController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, ticketId, eventId } = req.body;
    if (!userId || !ticketId || !eventId) {
        res.status(400).json({ message: "User ID, ticket ID, and event ID are required" });
        return;
    }
    try {
        const result = yield (0, eventService_1.cancelTicketAndReassign)(Number(userId), ticketId, Number(eventId));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error canceling and reassigning ticket:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.cancelAndReassignController = cancelAndReassignController;
const addTicketsToEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, newTickets } = req.body;
    try {
        // Add tickets to the event
        yield (0, eventService_1.addTicketsToEvent)(eventId, newTickets);
        // Assign tickets to waiting list users if any
        yield (0, eventService_1.assignTicketsFromWaitingList)(eventId, newTickets);
        res.status(200).json({ message: `${newTickets} tickets added and reassigned from the waiting list.` });
    }
    catch (error) {
        console.error("Error adding tickets or assigning waiting list:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.addTicketsToEventController = addTicketsToEventController;
const getEventStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    if (!eventId) {
        res.status(400).json({ message: "Event ID is required." });
        return;
    }
    try {
        const status = yield (0, eventService_1.getEventStatus)(Number(eventId));
        if (!status) {
            res.status(404).json({ message: `Event with ID ${eventId} not found.` });
            return;
        }
        res.status(200).json({ message: "Event status retrieved successfully.", status });
    }
    catch (error) {
        console.error("Error fetching event status:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getEventStatusController = getEventStatusController;
