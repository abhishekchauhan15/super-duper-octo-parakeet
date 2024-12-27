import express, { Router } from "express";
import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import KAM, { IUser } from "../models/user";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await KAM.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new KAM({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await KAM.findOne({ email }) as IUser;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

export default router;
