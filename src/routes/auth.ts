import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import KAM, { IKAM } from "../models/KAM";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await KAM.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new KAM({ name, email, password });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post(
  "/login",
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
      const user = await KAM.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      return res.status(200).json({ token, user });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
