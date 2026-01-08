import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true }, // Keep for backward compatibility
    
    // GPS Location Data
    gpsLocation: {
        name: { type: String }, // "Bali, Indonesia"
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        },
        address: { type: String }, // Full address
        city: { type: String },
        country: { type: String },
        zipCode: { type: String }
    },

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
    },

    // Like system
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalLikes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Tour", tourSchema);


