import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
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
photoSchema.index({ uploadedBy: 1, createdAt: -1 });
photoSchema.index({ isApproved: 1, createdAt: -1 });
photoSchema.index({ tags: 1 });
photoSchema.index({ totalLikes: -1 }); // For popular photos

export default mongoose.model("Photo", photoSchema);