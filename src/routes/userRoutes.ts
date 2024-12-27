import express from "express";
import { registerUser, loginUser } from "../controllers/userController";
// import { auth } from "../middleware/auth"; // Import auth middleware

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

export default userRoutes;
