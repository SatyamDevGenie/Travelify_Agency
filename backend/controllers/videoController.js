import Video from "../models/videoModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * @desc    Upload a new video
 * @route   POST /api/videos/upload
 * @access  Private
 */
export const uploadVideo = async (req, res) => {
    try {
        const { title, description, location, tags } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!title || !req.file) {
            return res.status(400).json({
                success: false,
                message: "Title and video file are required"
            });
        }

        // Validate file size (max 100MB for videos)
        const maxSize = 100 * 1024 * 1024; // 100MB in bytes
        if (req.file.size > maxSize) {
            // Clean up uploaded file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "File size too large. Maximum size is 100MB."
            });
        }

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            // Clean up uploaded file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Only MP4, MOV, and AVI are allowed."
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "travelify/user-videos",
            resource_type: "video",
            transformation: [
                { quality: "auto" },
                { format: "mp4" }
            ]
        });

        // Clean up local file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Parse tags if provided
        let parsedTags = [];
        if (tags) {
            if (typeof tags === 'string') {
                parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            } else if (Array.isArray(tags)) {
                parsedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
        }

        // Create video record
        const video = new Video({
            title: title.trim(),
            description: description ? description.trim() : "",
            videoUrl: result.secure_url,
            thumbnailUrl: result.secure_url.replace(/\.[^/.]+$/, ".jpg"), // Generate thumbnail URL
            publicId: result.public_id,
            uploadedBy: userId,
            location: location ? location.trim() : "",
            tags: parsedTags,
            fileSize: result.bytes,
            duration: result.duration,
            dimensions: {
                width: result.width,
                height: result.height
            },
            format: result.format
        });

        await video.save();

        // Populate user details for response
        await video.populate('uploadedBy', 'name');

        res.status(201).json({
            success: true,
            message: "Video uploaded successfully!",
            data: video
        });

    } catch (error) {
        console.error("Error uploading video:", error);
        
        // Clean up local file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "Error uploading video",
            error: error.message
        });
    }
};

/**
 * @desc    Get all approved videos (public gallery)
 * @route   GET /api/videos
 * @access  Public
 */
export const getVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const tag = req.query.tag;
        const location = req.query.location;

        // Build filter
        let filter = { isApproved: true };
        if (tag) {
            filter.tags = { $in: [tag] };
        }
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Get videos with user details
        const videos = await Video.find(filter)
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalVideos = await Video.countDocuments(filter);

        res.json({
            success: true,
            data: {
                videos,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalVideos / limit),
                    totalVideos,
                    hasNextPage: page < Math.ceil(totalVideos / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching videos",
            error: error.message
        });
    }
};

/**
 * @desc    Get user's uploaded videos
 * @route   GET /api/videos/my-videos
 * @access  Private
 */
export const getMyVideos = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const videos = await Video.find({ uploadedBy: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalVideos = await Video.countDocuments({ uploadedBy: userId });

        res.json({
            success: true,
            data: {
                videos,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalVideos / limit),
                    totalVideos,
                    hasNextPage: page < Math.ceil(totalVideos / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching user videos:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching your videos",
            error: error.message
        });
    }
};

/**
 * @desc    Like/Unlike a video
 * @route   POST /api/videos/:id/like
 * @access  Private
 */
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        const hasLiked = video.likes.includes(userId);

        if (hasLiked) {
            // Unlike
            video.likes = video.likes.filter(like => like.toString() !== userId.toString());
            video.totalLikes = Math.max(0, video.totalLikes - 1);
        } else {
            // Like
            video.likes.push(userId);
            video.totalLikes += 1;
        }

        await video.save();

        res.json({
            success: true,
            message: hasLiked ? "Video unliked" : "Video liked",
            data: {
                liked: !hasLiked,
                totalLikes: video.totalLikes
            }
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({
            success: false,
            message: "Error updating like",
            error: error.message
        });
    }
};

/**
 * @desc    Increment video views
 * @route   POST /api/videos/:id/view
 * @access  Public
 */
export const incrementViews = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await Video.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        res.json({
            success: true,
            data: {
                views: video.views
            }
        });

    } catch (error) {
        console.error("Error incrementing views:", error);
        res.status(500).json({
            success: false,
            message: "Error updating views",
            error: error.message
        });
    }
};

/**
 * @desc    Delete a video
 * @route   DELETE /api/videos/:id
 * @access  Private
 */
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        // Check if user owns this video or is admin
        if (video.uploadedBy.toString() !== userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own videos"
            });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(video.publicId, { resource_type: "video" });
        } catch (cloudinaryError) {
            console.error("Error deleting from Cloudinary:", cloudinaryError);
            // Continue with database deletion even if Cloudinary fails
        }

        // Delete from database
        await Video.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Video deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting video",
            error: error.message
        });
    }
};

/**
 * @desc    Get popular tags
 * @route   GET /api/videos/tags
 * @access  Public
 */
export const getPopularTags = async (req, res) => {
    try {
        const tags = await Video.aggregate([
            { $match: { isApproved: true } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json({
            success: true,
            data: tags.map(tag => ({
                name: tag._id,
                count: tag.count
            }))
        });

    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching tags",
            error: error.message
        });
    }
};