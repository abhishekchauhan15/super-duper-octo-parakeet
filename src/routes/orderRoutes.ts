import { Router } from "express";
import { 
  createOrder, 
  getAllOrders, 
  getOrdersByLeadId,
  updateOrder,
  deleteOrder
} from "../controllers/orderController";

const router = Router();


router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/lead/:id", getOrdersByLeadId);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router; 