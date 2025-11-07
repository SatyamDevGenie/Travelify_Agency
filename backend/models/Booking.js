import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "unpaid" },
    paymentId: String,
});


export default mongoose.model("Booking", bookingSchema);
