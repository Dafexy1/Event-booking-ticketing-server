import { Event } from "../model/schemas/eventSchema";
import { WaitingList } from "../model/schemas/waitingListSchema";
import { User } from "../model/schemas/userSchema";
import { Event as EventModel } from "../model/schemas/eventSchema";





export const createEvent = async (eventData: { name: string, totalTickets: number, availableTickets: number }) => {
  const event = await Event.create(eventData);
  return event;
};



export const getAllEvents = async () => {
  const events = await Event.findAll();
  return events;
};



export const getWaitingListByEvent = async (eventId: number) => {
  const waitingList = await WaitingList.findAll({
    where: { eventId },
    order: [["createdAt", "ASC"]], // FIFO order
  });
  return waitingList;
};


/**
 * Assigns tickets from the waiting list to users.
 * @param eventId - The ID of the event 
 * @param newTickets - The number of tickets to assign.
 */


// this will serve more of like the manual assignment when called
export const assignTicketsFromWaitingList = async (eventId: number, newTickets: number): Promise<void> => {
  const event = await EventModel.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found.");
  }

  // Fetch users on the waiting list for the event
  const waitingList = await WaitingList.findAll({
    where: { eventId },
    order: [["createdAt", "ASC"]], // Assign tickets to users in the order they joined
  });

  let ticketsToAssign = newTickets;

  for (const userInWaitingList of waitingList) {
    if (ticketsToAssign <= 0) break; // Stop if no tickets are left to assign

    const user = await User.findByPk(userInWaitingList.userId);
    if (!user) continue; // Skip if the user does not exist

    if (!Array.isArray(user.ticketsPurchased)) {
      user.ticketsPurchased = [];
    }
    if (!user.ticketStatus) {
      user.ticketStatus = {};
    }

    // Assume the userInWaitingList includes the number of tickets requested
    const ticketsRequested = userInWaitingList.numberOfTickets;

    // Check if we have enough tickets to fulfill the request
    const ticketsToGive = Math.min(ticketsRequested, ticketsToAssign);

    // Ensure available tickets do not go negative
    if (event.availableTickets - ticketsToGive < 0) {
      throw new Error("Not enough available tickets to fulfill the request.");
    }

    // Assign tickets to the user
    for (let i = 0; i < ticketsToGive; i++) {
      const ticketId = `${eventId}-ticket-${event.totalTickets - event.availableTickets + 1}`;
      user.ticketsPurchased.push(ticketId);
      user.ticketStatus[ticketId] = "booked"; // Mark ticket as booked
      ticketsToAssign--;
      event.availableTickets--; // Decrease available tickets
    }

    // Update the database for each ticket assignment
    await user.save();
    await event.save();

    // If the user receives all the tickets they requested, remove them from the waiting list
    if (ticketsToGive === ticketsRequested) {
      await userInWaitingList.destroy();
    } else {
      // Update the user's remaining tickets request on the waiting list
      userInWaitingList.numberOfTickets -= ticketsToGive;
      await userInWaitingList.save();
    }
  }
};


/**
 * Adds tickets to an event.
 * @param eventId - The ID of the event.
 * @param newTickets - The number of new tickets to add.
 */

export const addTicketsToEvent = async (eventId: number, newTickets: number): Promise<void> => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found.`);
  }

  // Update the available tickets and total tickets
  event.availableTickets += newTickets;
  event.totalTickets += newTickets;
  await event.save();
};


// the is an automated function that assigns cancelled tickets to users on the waiting list base on user ticket purchase order
export const cancelTicketAndReassign = async (userId: number, ticketId: string, eventId: number) => {
  const user = await User.findByPk(userId);
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
  await user.save();

  // Increment available tickets for the event
  const event = await EventModel.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found.");
  }
  event.availableTickets += 1;
  await event.save();

  // Reassign tickets from the waiting list
  const result = await assignTicketsFromWaitingList(eventId, 1);

  return {
    message: `Ticket ${ticketId} canceled and reassigned if applicable.`,
    result,
  };
};

/**
 * Retrieves the status of an event, including available tickets and waiting list count.
 * @param eventId - The ID of the event.
 * @returns An object containing availableTickets and waitingListCount, or null if the event doesn't exist.
 */
export const getEventStatus = async (eventId: number): Promise<{ availableTickets: number; waitingListCount: number } | null> => {
  const event = await Event.findByPk(eventId);

  if (!event) {
    return null; // Event not found
  }

  const waitingListCount = await WaitingList.count({
    where: { eventId },
  });

  return {
    availableTickets: event.availableTickets,
    waitingListCount,
  };
};