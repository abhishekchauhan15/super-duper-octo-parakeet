import express from "express";
import { registerUser, loginUser } from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

export default userRoutes;
