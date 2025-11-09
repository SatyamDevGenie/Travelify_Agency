import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    amount: Number,
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    status: { type: String, enum: ["Pending", "Approved", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
