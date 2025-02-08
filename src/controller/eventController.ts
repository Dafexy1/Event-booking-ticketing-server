import { Request, Response } from "express";
import { createEvent, getAllEvents, getWaitingListByEvent, 
  assignTicketsFromWaitingList, cancelTicketAndReassign, addTicketsToEvent, getEventStatus } from "../services/eventService";


export const createEventController = async (req: any, res: any) => {
  try {
    const { name, totalTickets, availableTickets } = req.body;

    if (!name || !totalTickets || !availableTickets) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await createEvent({ name, totalTickets, availableTickets });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllEventsController = async (_req: any, res: any) => {
  try {
    const events = await getAllEvents();
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getWaitingListController = async (req: any, res: any) => {
  const { eventId } = req.params;

  try {
    const waitingList = await getWaitingListByEvent(Number(eventId));
    if (waitingList.length === 0) {
      return res.status(404).json({ message: "No users found in the waiting list for this event." });
    }
    res.status(200).json({ waitingList });
  } catch (error) {
    console.error("Error fetching waiting list:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const assignTicketsController = async (req: any, res: any) => {
  const { eventId } = req.params;
  const { newTickets } = req.body;

  if (!eventId || !newTickets) {
    res.status(400).json({ message: "Event ID and newTickets are required" });
    return;
  }

  try {
    await assignTicketsFromWaitingList(Number(eventId), Number(newTickets));
    res.status(200).json({message: "Tickets assigned successfully from waiting List"});
  } catch (error) {
    console.error("Error assigning tickets from waiting list:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const cancelAndReassignController = async (req: any, res: any) => {
  const { userId, ticketId, eventId } = req.body;
  if (!userId || !ticketId || !eventId) {
    res.status(400).json({ message: "User ID, ticket ID, and event ID are required" });
    return;
  }
  try {
    const result = await cancelTicketAndReassign(Number(userId), ticketId, Number(eventId));
    res.status(200).json(result);
  } catch (error) {
    console.error("Error canceling and reassigning ticket:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const addTicketsToEventController = async (req: any, res: any) => {
  const { eventId, newTickets } = req.body;

  try {
    // Add tickets to the event
    await addTicketsToEvent(eventId, newTickets);

    // Assign tickets to waiting list users if any
    await assignTicketsFromWaitingList(eventId, newTickets);

    res.status(200).json({ message: `${newTickets} tickets added and reassigned from the waiting list.` });
  } catch (error) {
    console.error("Error adding tickets or assigning waiting list:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getEventStatusController = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  if (!eventId) {
    res.status(400).json({ message: "Event ID is required." });
    return;
  }

  try {
    const status = await getEventStatus(Number(eventId));

    if (!status) {
      res.status(404).json({ message: `Event with ID ${eventId} not found.` });
      return;
    }

    res.status(200).json({ message: "Event status retrieved successfully.", status });
  } catch (error) {
    console.error("Error fetching event status:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
