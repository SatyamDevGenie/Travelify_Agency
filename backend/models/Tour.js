import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    price: Number,
    slots: Number,
    image: String,
});

export default mongoose.model("Tour", tourSchema);
