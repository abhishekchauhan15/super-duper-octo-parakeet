import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import connectDB from "./db";
import { auth } from "./middleware/auth";
import userRoutes from "./routes/userRoutes";
import leadRoutes from "./routes/leadRoutes";
import contactRoutes from "./routes/contactRoutes";
import performanceRoutes from "./routes/performanceRoutes";
import interactionRoutes from "./routes/interactionRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use morgan for logging HTTP requests
app.use(morgan("combined"));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/leads', auth , leadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/performance", auth, performanceRoutes);
app.use("/api/interactions", auth, interactionRoutes);
app.use("/api/order", auth, orderRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Server is working!!!" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
