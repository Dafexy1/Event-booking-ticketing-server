import { Request, Response, NextFunction } from "express";
import { Event } from "../model/schemas/eventSchema";
import { sequelize } from '../database/sequelize';
//import NodeCache from "nodecache";


 // Middleware to handle concurrent ticket purchases.
 export const concurrencyHandler = async (req: any, res: any, next: NextFunction) => {
   const { eventId, numberOfTickets } = req.body;
 
   if (!eventId || !numberOfTickets) {
     return res.status(400).json({ message: "Event-ID and number of tickets to purchase are required." });
   }
 
   // Begin transaction
   const transaction = await sequelize.transaction();
   try {
     // Lock the event row for updates (to prevent concurrent changes)
     const event = await Event.findOne({
       where: { id: eventId },
       lock: transaction.LOCK.UPDATE,
       transaction,
     });
 
     if (!event) {
       await transaction.rollback();
       return res.status(404).json({ message: "Event not found." });
     }
 
     // Check if there is enough tickets available
     if (event.availableTickets < numberOfTickets) {
       await transaction.rollback();
       return res.status(400).json({
         message: `Not enough tickets available. Only ${event.availableTickets} tickets left. Try a lesser number.`,
       });
     }
 
     // Deduct the tickets from availableTickets
     event.availableTickets -= numberOfTickets;
     await event.save({ transaction });
 
     // Commit the transaction
     await transaction.commit();
 
     next(); // Pass to the next middleware or controller
   } catch (error) {
     // Rollback the transaction in case of errors
     if (transaction) await transaction.rollback();
 
     console.error("Error handling concurrency:", error);
     res.status(500).json({ message: "Internal server error", error });
   }
 };
 