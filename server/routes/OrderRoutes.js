import express from "express";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

// ========================================
// CREATE ORDER
// ========================================

router.post("/", createOrder);

// ========================================
// GET MY ORDERS
// ========================================
// IMPORTANT: This must come BEFORE /:id

router.get("/user/:userId", getMyOrders);

// ========================================
// GET ALL ORDERS
// ========================================

router.get("/", getAllOrders);

// ========================================
// GET SINGLE ORDER
// ========================================

router.get("/:id", getOrderById);

// ========================================
// UPDATE ORDER STATUS
// ========================================

router.put("/:id/status", updateOrderStatus);

// ========================================
// DELETE ORDER
// ========================================

router.delete("/:id", deleteOrder);

export default router;