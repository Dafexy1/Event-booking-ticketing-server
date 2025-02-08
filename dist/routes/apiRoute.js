"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const eventController_1 = require("../controller/eventController");
const router = (0, express_1.Router)();
// Placeholder Route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to SentinelAI API Gateway" });
});
// User routes
router.post("/users", userController_1.createUserController);
router.get("/users", userController_1.getAllUsersController);
router.post("/users/purchase-ticket", userController_1.purchaseTicketController);
router.post("/users/cancel-ticket", userController_1.cancelTicketController);
router.get('/users/:id', userController_1.getUserByIdController);
// Event routes
router.post("/events", eventController_1.createEventController);
router.get("/events", eventController_1.getAllEventsController);
// Fetch waiting list for an event
router.get("/events/:eventId/waiting-list", eventController_1.getWaitingListController);
// Assign tickets from waiting list
router.post("/events/:eventId/assign-tickets", eventController_1.assignTicketsController);
// Cancel ticket and reassign
router.post("/events/cancel-ticket", eventController_1.cancelAndReassignController);
// Add tickets to event and reassign from waiting list
router.post("/events/add-tickets", eventController_1.addTicketsToEventController);
// get an event with status and waiting list
router.get("/events/status/:eventId", eventController_1.getEventStatusController);
exports.default = router;
