import express from "express";
import {
    register,
    login,
    getUserProfile,
    updateUserProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)

export default router;
