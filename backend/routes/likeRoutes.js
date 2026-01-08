import express from "express";
import {
    toggleTourLike,
    toggleVideoLike,
    togglePhotoLike,
    getUserLikes
} from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Like/Unlike routes
router.post("/tour/:id", toggleTourLike);
router.post("/video/:id", toggleVideoLike);
router.post("/photo/:id", togglePhotoLike);

// Get user's likes
router.get("/user", getUserLikes);

export default router;