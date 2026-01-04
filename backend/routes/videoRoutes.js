import express from "express";
import multer from "multer";
import {
    uploadVideo,
    getVideos,
    getMyVideos,
    toggleLike,
    incrementViews,
    deleteVideo,
    getPopularTags
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer configuration for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `video-${uniqueSuffix}-${file.originalname}`);
    },
});

// File filter for videos only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});

// Public routes
router.get("/", getVideos);
router.get("/tags", getPopularTags);
router.post("/:id/view", incrementViews);

// Protected routes
router.post("/upload", protect, upload.single("video"), uploadVideo);
router.get("/my-videos", protect, getMyVideos);
router.post("/:id/like", protect, toggleLike);
router.delete("/:id", protect, deleteVideo);

export default router;