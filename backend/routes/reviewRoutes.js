import express from "express";
import {
    createReview,
    getTourReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    canReviewTour
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/tour/:tourId", getTourReviews);

// Protected routes
router.post("/", protect, createReview);
router.get("/my-reviews", protect, getMyReviews);
router.get("/can-review/:tourId", protect, canReviewTour);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;