import { Event as EventModel } from "../model/schemas/eventSchema";
import { User } from "../model/schemas/userSchema";
import { WaitingList } from "../model/schemas/waitingListSchema";
import { sequelize } from '../database/sequelize';




export const createUser = async (userData: { email: string }) => {
  // Check if the user already exists
  const findUser = await User.findOne({
    where: { email: userData.email },
  });

  if (findUser) {
    throw new Error("User with the same email already exists");
  }

  // Create a new user if no duplicate is found
  const user = await User.create(userData);
  return user;
};



export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};



export const getUserById = async (id: number) => {
  try {
    const user = await User.findByPk(id);
    return user || null; 
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};




export const purchaseTicket = async (userId: number, eventId: number, numberOfTickets: number) => {
  const transaction = await sequelize.transaction(); 
  let transactionCompleted = false; 

  try {
    // Fetch the event with a lock
    const event = await EventModel.findOne({
      where: { id: eventId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!event) {
      throw new Error("Event not found.");
    }

    // Check ticket availability
    if (event.availableTickets < numberOfTickets) {

      // Add to waiting list and commit the insertion
      await WaitingList.create({ userId, eventId, numberOfTickets }, { transaction });
      
      // Commit the transaction after adding to the waiting list
      await transaction.commit();
      transactionCompleted = true;

      throw new Error(`Tickets are sold out. You have been added to the waiting list for ${event.name}.`);
    }

    // Fetch the user with a lock
    const user = await User.findOne({
      where: { id: userId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!user) {
      throw new Error("User not found.");
    }


    // Initialize user ticket fields if undefined
    user.ticketsPurchased = user.ticketsPurchased || [];
    user.ticketStatus = user.ticketStatus || {};

    // Generate new tickets
    const newTickets = Array.from({ length: numberOfTickets }, (_, i) => {
      const ticketId = `${eventId}-ticket-${event.totalTickets - event.availableTickets + 1 + i}`;
      user.ticketsPurchased.push(ticketId);
      user.ticketStatus[ticketId] = "booked";
      return ticketId;
    });

    // Deduct tickets from the event
    event.availableTickets -= numberOfTickets;

    // Save changes
    await user.save({ transaction });
    await event.save({ transaction });

    // Commit the transaction
    await transaction.commit();
    transactionCompleted = true;

    return {
      status: "success",
      message: `Tickets purchased successfully for ${event.name}.`,
      ticketsPurchased: newTickets,
    };
  } catch (error: any) {


    if (!transactionCompleted) {
      await transaction.rollback();
      console.log("Transaction rolled back");
    }

   
    return {
      status: error.message.includes("waiting list") ? "waiting_list" : "error",
      message: error.message || "Failed to process ticket purchase. Please try again later.",
    };
  }
};










// export const purchaseTicket = async (userId: number, eventId: number, numberOfTickets: number) => {
//   // Find the event by ID
//   const event = await EventModel.findByPk(eventId);
//   if (!event) {
//     throw new Error("Event not found.");
//   }

//   // Check if there are enough tickets available
//   if (event.availableTickets < numberOfTickets) {
//     // If tickets are exhausted, add the user to the waiting list
//     await WaitingList.create({
//       userId,
//       eventId,
//       numberOfTickets,
//     });

//     return {
//       message: `Tickets are sold out. User has been added to the waiting list for ${event.name}.`,
//     };
//   }

//   // Find the user by ID
//   const user = await User.findByPk(userId);
//   if (!user) {
//     throw new Error("User not found.");
//   }

//   // Ensure `ticketsPurchased` and `ticketStatus` are properly initialized
//   if (!Array.isArray(user.ticketsPurchased)) {
//     user.ticketsPurchased = [];
//   }
//   if (!user.ticketStatus) {
//     user.ticketStatus = {};
//   }

//   // Generate and add tickets to the user's `ticketsPurchased`
//   for (let i = 0; i < numberOfTickets; i++) {
//     const ticketId = `${eventId}-ticket-${event.totalTickets - event.availableTickets + 1 + i}`;
//     user.ticketsPurchased.push(ticketId);
//     user.ticketStatus[ticketId] = "booked"; // Set the ticket status to 'booked'
//   }

//   // Explicitly mark `ticketsPurchased` and `ticketStatus` as changed
//   user.changed("ticketsPurchased", true);
//   user.changed("ticketStatus", true);

//   // Update the available tickets for the event
//   event.availableTickets -= numberOfTickets;

//   // Save changes to the user and event
//   await user.save();
//   await event.save();

//   return {
//     message: `${numberOfTickets} tickets successfully purchased for ${event.name}.`,
//     ticketsPurchased: user.ticketsPurchased,
//     ticketStatus: user.ticketStatus,
//   };
// };




export const cancelTicket = async (userId: number, ticketId: string) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.ticketsPurchased.includes(ticketId)) {
    throw new Error("Ticket not found for this user.");
  }

  if (user.ticketStatus[ticketId] === "cancelled") {
    throw new Error("Ticket is already cancelled.");
  }

  const eventId = parseInt(ticketId.split("-")[0], 10);
  const event = await EventModel.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found.");
  }

  user.ticketStatus[ticketId] = "cancelled";
  event.availableTickets += 1;

  await user.save();
  await event.save();

  return `Ticket ${ticketId} successfully cancelled for event ${event.name}.`;
};

