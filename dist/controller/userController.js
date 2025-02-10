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
exports.cancelTicketController = exports.purchaseTicketController = exports.getUserByIdController = exports.getAllUsersController = exports.createUserController = void 0;
const userService_1 = require("../services/userService");
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
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = yield (0, userService_1.createUser)({ email });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        console.error("Error creating user:", error.message);
        if (error.messge === "User with the same email already exists") {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.createUserController = createUserController;
const getAllUsersController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getAllUsers)();
        res.status(200).json({ users });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getAllUsersController = getAllUsersController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, userService_1.getUserById)(Number(id));
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error(`Error fetching user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getUserByIdController = getUserByIdController;
const purchaseTicketController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, eventId, numberOfTickets } = req.body;
        if (!userId || !eventId || !numberOfTickets) {
            return res.status(400).json({
                message: "userId, eventId, and numberOfTickets are required.",
            });
        }
        const result = yield (0, userService_1.purchaseTicket)(userId, eventId, numberOfTickets);
        res.status(result.status === "error" ? 400 : 200).json(result);
    }
    catch (error) {
        console.error("Error purchasing tickets:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.purchaseTicketController = purchaseTicketController;
const cancelTicketController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, ticketId } = req.body;
        if (!userId || !ticketId) {
            return res.status(400).json({
                message: "userId and ticketId are required.",
            });
        }
        const message = yield (0, userService_1.cancelTicket)(userId, ticketId);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error("Error cancelling ticket:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.cancelTicketController = cancelTicketController;
