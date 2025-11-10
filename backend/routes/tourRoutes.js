import express from "express";
import multer from "multer";
import {
    getTours,
    createTour,
    updateTour,
    deleteTour,
} from "../controllers/tourController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Proper Multer Storage (temporary local before Cloudinary upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get("/", getTours);
router.post("/", protect, admin, upload.single("image"), createTour);
router.put("/:id", protect, admin, upload.single("image"), updateTour);
router.delete("/:id", protect, admin, deleteTour);

export default router;



