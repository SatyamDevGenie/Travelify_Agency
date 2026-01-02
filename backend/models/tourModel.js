import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    category: {
        type: String,
        enum: [
            "Domestic",
            "International"
        ],
        required: true
    },

    subcategory: {
        type: String,
        required: false, // e.g. "Goa", "Thailand", "Dubai"
    },

    price: { type: Number, required: true },
    availableSlots: { type: Number, default: 0 },
    image: { type: String },
    
    // Review fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Tour", tourSchema);


