import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    isVerified: {
        type: Boolean,
        default: false // True if user has actually booked this tour
    }
}, { 
    timestamps: true 
});

// Ensure one review per user per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);