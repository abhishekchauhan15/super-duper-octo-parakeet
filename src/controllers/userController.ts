import { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../middleware/auth";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Required fields check
    if (!name || !email || !password || !role) {
       res.status(400).json({ error: "All fields are required" });
       return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       res.status(400).json({ error: "Invalid email format" });
       return
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ error: "Email already in use" });
       return
    }

    // Password validation
    if (password.length < 8) {
       res.status(400).json({ error: "Password must be at least 8 characters long" });
       return
    }

    // Role validation (example roles)
    const validRoles = ['KAM', 'Admin'];
    if (!validRoles.includes(role)) {
       res.status(400).json({ error: "Invalid role" });
       return
    }

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
       res.status(404).json({ error: "User not found" });
       return 
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       res.status(401).json({ error: "Invalid credentials" });
       return 
    }

    const token = generateToken((user as any)._id.toString()); 
    res.status(200).json({ message: "Login successful", token });
    return;

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
