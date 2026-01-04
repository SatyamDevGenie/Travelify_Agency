import express from "express";
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlistStatus,
    getWishlistCount
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Wishlist routes
router.get("/", getWishlist);
router.get("/count", getWishlistCount);
router.get("/check/:tourId", checkWishlistStatus);
router.post("/:tourId", addToWishlist);
router.delete("/:tourId", removeFromWishlist);

export default router;