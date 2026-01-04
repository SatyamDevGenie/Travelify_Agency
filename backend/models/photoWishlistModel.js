import mongoose from "mongoose";

const photoWishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        required: true
    }
}, { 
    timestamps: true 
});

// Ensure a user can't add the same photo to wishlist multiple times
photoWishlistSchema.index({ user: 1, image: 1 }, { unique: true });

// Index for better performance
photoWishlistSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("PhotoWishlist", photoWishlistSchema);