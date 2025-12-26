import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
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
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    razorpayOrderId: {
        type: String,
        required: false
    },
    razorpayPaymentId: {
        type: String,
        required: false
    },
    razorpaySignature: {
        type: String,
        required: false
    },
    guestDetails: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        }
    },
    rejectionReason: {
        type: String,
        required: false
    }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);