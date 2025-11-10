import express from "express";
import {
    createOrder,
    verifyPayment,
    updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.put("/:id/status", protect, admin, updateBookingStatus);

export default router;
