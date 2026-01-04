import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
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
    views: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true // Auto-approve for now
    },
    fileSize: {
        type: Number // Size in bytes
    },
    duration: {
        type: Number // Duration in seconds
    },
    dimensions: {
        width: Number,
        height: Number
    },
    format: {
        type: String // mp4, mov, etc.
    }
}, { 
    timestamps: true 
});

// Index for better performance
videoSchema.index({ uploadedBy: 1, createdAt: -1 });
videoSchema.index({ isApproved: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ views: -1 }); // For popular videos

export default mongoose.model("Video", videoSchema);