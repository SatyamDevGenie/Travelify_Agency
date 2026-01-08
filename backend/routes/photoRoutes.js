import express from "express";
import {
    uploadPhoto,
    getAllPhotos,
    getPopularPhotos,
    getUserPhotos,
    deletePhoto,
    incrementPhotoViews
} from "../controllers/photoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload, handleUploadError } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPhotos);
router.get("/popular", getPopularPhotos);
router.post("/:id/view", incrementPhotoViews);

// Protected routes
router.post("/upload", protect, upload.single('photo'), handleUploadError, uploadPhoto);
router.get("/my-photos", protect, getUserPhotos);
router.delete("/:id", protect, deletePhoto);

export default router;