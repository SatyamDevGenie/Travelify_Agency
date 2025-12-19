import express from "express";
import {
    createOrder,
    verifyPayment,
    getMyBookings,
    getAllBookings,
    getBookingById,
    confirmBooking,
    cancelBooking,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes (specific routes first)
router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my-bookings", protect, getMyBookings);

// Admin routes (specific routes first)
router.get("/all/bookings", protect, admin, getAllBookings);

// Parameterized routes (must come after specific routes)
router.get("/:id", protect, getBookingById);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.put("/:id/cancel", protect, admin, cancelBooking);

export default router;

