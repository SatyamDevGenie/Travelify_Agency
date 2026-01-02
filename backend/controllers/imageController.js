import Image from "../models/imageModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * @desc    Upload a new image
 * @route   POST /api/images/upload
 * @access  Private
 */
export const uploadImage = async (req, res) => {
    try {
        const { title, description, location, tags } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!title || !req.file) {
            return res.status(400).json({
                success: false,
                message: "Title and image file are required"
            });
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (req.file.size > maxSize) {
            // Clean up uploaded file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "File size too large. Maximum size is 10MB."
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            // Clean up uploaded file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "travelify/user-uploads",
            transformation: [
                { quality: "auto" },
                { fetch_format: "auto" }
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

        // Create image record
        const image = new Image({
            title: title.trim(),
            description: description ? description.trim() : "",
            imageUrl: result.secure_url,
            publicId: result.public_id,
            uploadedBy: userId,
            location: location ? location.trim() : "",
            tags: parsedTags,
            fileSize: result.bytes,
            dimensions: {
                width: result.width,
                height: result.height
            },
            format: result.format
        });

        await image.save();

        // Populate user details for response
        await image.populate('uploadedBy', 'name');

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully!",
            data: image
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        
        // Clean up local file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: error.message
        });
    }
};

/**
 * @desc    Get all approved images (public gallery)
 * @route   GET /api/images
 * @access  Public
 */
export const getImages = async (req, res) => {
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

        // Get images with user details
        const images = await Image.find(filter)
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalImages = await Image.countDocuments(filter);

        res.json({
            success: true,
            data: {
                images,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalImages / limit),
                    totalImages,
                    hasNextPage: page < Math.ceil(totalImages / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching images",
            error: error.message
        });
    }
};

/**
 * @desc    Get user's uploaded images
 * @route   GET /api/images/my-images
 * @access  Private
 */
export const getMyImages = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const images = await Image.find({ uploadedBy: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalImages = await Image.countDocuments({ uploadedBy: userId });

        res.json({
            success: true,
            data: {
                images,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalImages / limit),
                    totalImages,
                    hasNextPage: page < Math.ceil(totalImages / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching user images:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching your images",
            error: error.message
        });
    }
};

/**
 * @desc    Like/Unlike an image
 * @route   POST /api/images/:id/like
 * @access  Private
 */
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const image = await Image.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        const hasLiked = image.likes.includes(userId);

        if (hasLiked) {
            // Unlike
            image.likes = image.likes.filter(like => like.toString() !== userId.toString());
            image.totalLikes = Math.max(0, image.totalLikes - 1);
        } else {
            // Like
            image.likes.push(userId);
            image.totalLikes += 1;
        }

        await image.save();

        res.json({
            success: true,
            message: hasLiked ? "Image unliked" : "Image liked",
            data: {
                liked: !hasLiked,
                totalLikes: image.totalLikes
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
 * @desc    Delete an image
 * @route   DELETE /api/images/:id
 * @access  Private
 */
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const image = await Image.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        // Check if user owns this image or is admin
        if (image.uploadedBy.toString() !== userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own images"
            });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(image.publicId);
        } catch (cloudinaryError) {
            console.error("Error deleting from Cloudinary:", cloudinaryError);
            // Continue with database deletion even if Cloudinary fails
        }

        // Delete from database
        await Image.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Image deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting image",
            error: error.message
        });
    }
};

/**
 * @desc    Get popular tags
 * @route   GET /api/images/tags
 * @access  Public
 */
export const getPopularTags = async (req, res) => {
    try {
        const tags = await Image.aggregate([
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