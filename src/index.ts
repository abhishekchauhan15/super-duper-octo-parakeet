import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./db";
import { auth } from "./middleware/auth";
import userRoutes from "./routes/userRoutes"; 
import leadRoutes from "./routes/leadRoutes"; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();


// Routes
app.use('/api/users', userRoutes);
app.use('/api/leads', auth , leadRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("req is here ............");
  res.json({ message: "got the req" });
});


app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
