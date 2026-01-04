import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true
    }
}, { 
    timestamps: true 
});

// Ensure a user can't add the same tour to wishlist multiple times
wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });

// Index for better performance
wishlistSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Wishlist", wishlistSchema);