import { Request, Response } from "express";
import { createUser, getAllUsers, purchaseTicket, cancelTicket, getUserById } from "../services/userService";
import { BadRequestError } from "../middleware/error";
import { returnMsg } from "../middleware/msgHandler";


// export const createUserController = async (req:any , res: any) => {
//   try {
//     const { email } = req.body;

//     if (!email || email.trim() === "") {
//       throw new BadRequestError("Email is required");
//     }

//     const user = await createUser({ email });

//     res.status(201).json(returnMsg({ user }, "User created successfully"));
//   } catch (error: any) {
//     console.error("Error creating user:", error);
//     if (error instanceof BadRequestError) {
//       return res.status(400).json({ message: error.message });
//     }

//     // Handle unexpected errors
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


export const createUserController = async (req: any, res: any) => {
  try {
    const { email } = req.body;
        if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

    const user = await createUser({ email });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    console.error("Error creating user:", error.message);

    if (error.messge === "User with the same email already exists") {

    return res.status(409).json({message: error.message });
  }
  res.status(500).json({error: error.message});
}
};



export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getUserByIdController = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const user = await getUserById(Number(id));
  
      if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found` });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(`Error fetching user with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };


  export const purchaseTicketController = async (req: any, res: any) => {
    try {
      const { userId, eventId, numberOfTickets } = req.body;
  
      if (!userId || !eventId || !numberOfTickets) {
        return res.status(400).json({
          message: "userId, eventId, and numberOfTickets are required.",
        });
      }
      const result = await purchaseTicket(userId, eventId, numberOfTickets);
  
      res.status(result.status === "error" ? 400 : 200).json(result);
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  
  export const cancelTicketController = async (req: any, res: any) => {
    try {
      const { userId, ticketId } = req.body;
  
      if (!userId || !ticketId) {
        return res.status(400).json({
          message: "userId and ticketId are required.",
        });
      }
  
      const message = await cancelTicket(userId, ticketId);
      res.status(200).json({ message });
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
