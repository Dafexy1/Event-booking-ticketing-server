import { Request, Response, NextFunction } from "express";
import { Event } from "../model/schemas/eventSchema";
import { sequelize } from '../database/sequelize';






/**
 * Middleware to handle concurrent ticket purchases.
 */
export const ticketPurchaseConcurrencyHandler = async ( req: Request, res: Response, next: NextFunction) => {
  const { eventId, ticketsToPurchase } = req.body;

  if (!eventId || !ticketsToPurchase) {
    return res.status(400).json({ message: "Event ID and ticketsToPurchase are required." });
  }

  try {
    // Use a transaction to ensure atomicity
    const transaction: any = await sequelize.transaction;

    try {
      // Lock the event row for updates (to prevent concurrent changes)
      const event = await Event.findOne({
        where: { id: eventId },
        lock: transaction.LOCK.UPDATE, // Locks the row until the transaction is complete
        transaction,
      });

      if (!event) {
        await transaction.rollback();
        return res.status(404).json({ message: "Event not found." });
      }

      // Check if there are enough tickets available
      if (event.availableTickets < ticketsToPurchase) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Not enough tickets available. Only ${event.availableTickets} tickets left.`,
        });
      }

      // Deduct the tickets from availableTickets
      event.availableTickets -= ticketsToPurchase;
      await event.save({ transaction });

      // Commit the transaction
      await transaction.commit();
      next(); // Pass to the next middleware or controller
    } catch (error) {
      // Rollback the transaction if anything goes wrong
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error handling concurrency:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
