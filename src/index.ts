import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from './routes/auth';
import KAM from './models/user';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("req is here ............");
  res.json({ message: "got the req" });
});


app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
