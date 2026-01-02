import express from "express";
import multer from "multer";
import {
    uploadImage,
    getImages,
    getMyImages,
    toggleLike,
    deleteImage,
    getPopularTags
} from "../controllers/imageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `image-${uniqueSuffix}-${file.originalname}`);
    },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

// Public routes
router.get("/", getImages);
router.get("/tags", getPopularTags);

// Protected routes
router.post("/upload", protect, upload.single("image"), uploadImage);
router.get("/my-images", protect, getMyImages);
router.post("/:id/like", protect, toggleLike);
router.delete("/:id", protect, deleteImage);

export default router;