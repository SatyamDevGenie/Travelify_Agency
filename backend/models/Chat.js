import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    sender: String,
    createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Chat", chatSchema);
