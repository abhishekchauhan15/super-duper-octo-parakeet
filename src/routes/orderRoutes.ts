import { Router } from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/orderController";

const router = Router();

// Define routes
router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById); 

export default router; 