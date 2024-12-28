import { Router } from "express";
import { createOrder, getAllOrders, getOrdersByLeadId } from "../controllers/orderController";

const router = Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/lead/:id", getOrdersByLeadId); 

export default router; 