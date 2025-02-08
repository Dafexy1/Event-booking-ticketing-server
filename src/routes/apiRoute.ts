import { Router } from "express";
import { limiter } from '../middleware/rateLimtter';
import { concurrencyHandler } from '../middleware/handleConcurrency';
import { createUserController, getAllUsersController, 
  purchaseTicketController, cancelTicketController, getUserByIdController } from "../controller/userController";
import { createEventController, getAllEventsController, getWaitingListController, 
  assignTicketsController, addTicketsToEventController, cancelAndReassignController, getEventStatusController
 } from "../controller/eventController";


const router: Router = Router();

// Placeholder Route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to SentinelAI API Gateway" });
});


// User routes
router.post("/users", createUserController);
router.get("/users", getAllUsersController);
router.post("/users/purchase-ticket", limiter, concurrencyHandler, purchaseTicketController);
router.post("/users/cancel-ticket", cancelTicketController);
router.get('/users/:id', getUserByIdController);

// Event routes
router.post("/events", createEventController);
router.get("/events", getAllEventsController);

// Fetch waiting list for an event
router.get("/events/:eventId/waiting-list", getWaitingListController);

// Assign tickets from waiting list
router.post("/events/:eventId/assign-tickets", assignTicketsController);

// Cancel ticket and reassign
router.post("/events/cancel-ticket", cancelAndReassignController);

// Add tickets to event and reassign from waiting list
router.post("/events/add-tickets", addTicketsToEventController);

// get an event with status and waiting list
router.get("/events/status/:eventId", getEventStatusController);


export default router;