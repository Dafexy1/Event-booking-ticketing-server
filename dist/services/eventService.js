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
exports.getEventStatus = exports.cancelTicketAndReassign = exports.addTicketsToEvent = exports.assignTicketsFromWaitingList = exports.getWaitingListByEvent = exports.getAllEvents = exports.createEvent = void 0;
const eventSchema_1 = require("../model/schemas/eventSchema");
const waitingListSchema_1 = require("../model/schemas/waitingListSchema");
const userSchema_1 = require("../model/schemas/userSchema");
const eventSchema_2 = require("../model/schemas/eventSchema");
const createEvent = (eventData) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield eventSchema_1.Event.create(eventData);
    return event;
});
exports.createEvent = createEvent;
const getAllEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield eventSchema_1.Event.findAll();
    return events;
});
exports.getAllEvents = getAllEvents;
const getWaitingListByEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const waitingList = yield waitingListSchema_1.WaitingList.findAll({
        where: { eventId },
        order: [["createdAt", "ASC"]], // FIFO order
    });
    return waitingList;
});
exports.getWaitingListByEvent = getWaitingListByEvent;
/**
 * Assigns tickets from the waiting list to users.
 * @param eventId - The ID of the event.
 * @param newTickets - The number of tickets to assign.
 */
const assignTicketsFromWaitingList = (eventId, newTickets) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield eventSchema_2.Event.findByPk(eventId);
    if (!event) {
        throw new Error("Event not found.");
    }
    // Fetch users on the waiting list for the event
    const waitingList = yield waitingListSchema_1.WaitingList.findAll({
        where: { eventId },
        order: [["createdAt", "ASC"]], // Assign tickets to users in the order they joined
    });
    let ticketsToAssign = newTickets;
    for (const userInWaitingList of waitingList) {
        if (ticketsToAssign <= 0)
            break; // Stop if no tickets are left to assign
        const user = yield userSchema_1.User.findByPk(userInWaitingList.userId);
        if (!user)
            continue; // Skip if the user does not exist
        if (!Array.isArray(user.ticketsPurchased)) {
            user.ticketsPurchased = [];
        }
        if (!user.ticketStatus) {
            user.ticketStatus = {};
        }
        // Assume the userInWaitingList includes the number of tickets requested
        const ticketsRequested = userInWaitingList.numberOfTickets; // Add `numberOfTickets` to WaitingList schema
        const ticketsToGive = Math.min(ticketsRequested, ticketsToAssign); // Assign tickets based on availability
        // Assign tickets to the user
        for (let i = 0; i < ticketsToGive; i++) {
            const ticketId = `${eventId}-ticket-${event.totalTickets - event.availableTickets + 1}`;
            user.ticketsPurchased.push(ticketId);
            user.ticketStatus[ticketId] = "booked"; // Mark ticket as booked
            ticketsToAssign--;
            event.availableTickets--;
            // Update the database for each ticket assignment
            yield user.save();
            yield event.save();
        }
        // If the user receives all the tickets they requested, remove them from the waiting list
        if (ticketsToGive === ticketsRequested) {
            yield userInWaitingList.destroy();
        }
        else {
            // Update the user's remaining tickets request on the waiting list
            userInWaitingList.numberOfTickets -= ticketsToGive;
            yield userInWaitingList.save();
        }
    }
});
exports.assignTicketsFromWaitingList = assignTicketsFromWaitingList;
/**
 * Adds tickets to an event.
 * @param eventId - The ID of the event.
 * @param newTickets - The number of new tickets to add.
 */
const addTicketsToEvent = (eventId, newTickets) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield eventSchema_1.Event.findByPk(eventId);
    if (!event) {
        throw new Error(`Event with ID ${eventId} not found.`);
    }
    // Update the available tickets and total tickets
    event.availableTickets += newTickets;
    event.totalTickets += newTickets;
    yield event.save();
});
exports.addTicketsToEvent = addTicketsToEvent;
// export const assignTicketsFromWaitingList = async (eventId: number) => {
//   const event = await EventModel.findByPk(eventId);
//   if (!event) {
//     throw new Error("Event not found.");
//   }
//   const waitingList = await getWaitingListByEvent(eventId);
//   if (waitingList.length === 0) {
//     console.log("No users in the waiting list for this event.");
//     return { message: "No users to assign tickets to." };
//   }
//   let ticketsAssigned = 0;
//   for (const waitingUser of waitingList) {
//     const { userId } = waitingUser;
//     if (event.availableTickets > 0) {
//       const user = await User.findByPk(userId);
//       if (user) {
//         if (!Array.isArray(user.ticketsPurchased)) {
//           user.ticketsPurchased = [];
//         }
//         if (!user.ticketStatus) {
//           user.ticketStatus = {};
//         }
//         // Assign a ticket to the user
//         const ticketId = `${eventId}-ticket-${event.totalTickets - event.availableTickets + 1}`;
//         user.ticketsPurchased.push(ticketId);
//         user.ticketStatus[ticketId] = "booked";
//         // Save user changes
//         user.changed("ticketsPurchased", true);
//         user.changed("ticketStatus", true);
//         await user.save();
//         // Decrement available tickets for the event
//         event.availableTickets -= 1;
//         ticketsAssigned += 1;
//         await event.save();
//         // Remove user from waiting list
//         await waitingUser.destroy();
//       }
//     } else {
//       break; // Stop if no tickets are available
//     }
//   }
//   return {
//     message: `Assigned ${ticketsAssigned} tickets to users from the waiting list.`,
//   };
// };
const cancelTicketAndReassign = (userId, ticketId, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.User.findByPk(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    // Remove the canceled ticket
    const ticketIndex = user.ticketsPurchased.indexOf(ticketId);
    if (ticketIndex === -1) {
        throw new Error("Ticket not found for this user.");
    }
    user.ticketsPurchased.splice(ticketIndex, 1);
    delete user.ticketStatus[ticketId];
    user.changed("ticketsPurchased", true);
    user.changed("ticketStatus", true);
    yield user.save();
    // Increment available tickets for the event
    const event = yield eventSchema_2.Event.findByPk(eventId);
    if (!event) {
        throw new Error("Event not found.");
    }
    event.availableTickets += 1;
    yield event.save();
    // Reassign tickets from the waiting list
    const result = yield (0, exports.assignTicketsFromWaitingList)(eventId, 1);
    return {
        message: `Ticket ${ticketId} canceled and reassigned if applicable.`,
        result,
    };
});
exports.cancelTicketAndReassign = cancelTicketAndReassign;
/**
 * Retrieves the status of an event, including available tickets and waiting list count.
 * @param eventId - The ID of the event.
 * @returns An object containing availableTickets and waitingListCount, or null if the event doesn't exist.
 */
const getEventStatus = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield eventSchema_1.Event.findByPk(eventId);
    if (!event) {
        return null; // Event not found
    }
    const waitingListCount = yield waitingListSchema_1.WaitingList.count({
        where: { eventId },
    });
    return {
        availableTickets: event.availableTickets,
        waitingListCount,
    };
});
exports.getEventStatus = getEventStatus;
