import express from "express";
import {
    addPhotoToWishlist,
    removePhotoFromWishlist,
    getPhotoWishlist,
    checkPhotoWishlistStatus
} from "../controllers/photoWishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Photo wishlist routes
router.get("/", getPhotoWishlist);
router.get("/check/:imageId", checkPhotoWishlistStatus);
router.post("/:imageId", addPhotoToWishlist);
router.delete("/:imageId", removePhotoFromWishlist);

export default router;