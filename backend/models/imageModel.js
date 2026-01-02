import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true // Cloudinary public ID for deletion
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: String,
        maxlength: 100
    },
    tags: [{
        type: String,
        maxlength: 30
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    totalLikes: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true // Auto-approve for now, can be changed to false for moderation
    },
    fileSize: {
        type: Number // Size in bytes
    },
    dimensions: {
        width: Number,
        height: Number
    },
    format: {
        type: String // jpg, png, etc.
    }
}, { 
    timestamps: true 
});

// Index for better performance
imageSchema.index({ uploadedBy: 1, createdAt: -1 });
imageSchema.index({ isApproved: 1, createdAt: -1 });
imageSchema.index({ tags: 1 });

export default mongoose.model("Image", imageSchema);