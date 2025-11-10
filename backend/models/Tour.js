import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    price: Number,
    availableSlots: Number,
    image: String,
},
    { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
