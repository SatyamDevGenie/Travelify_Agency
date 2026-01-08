import Photo from '../models/photoModel.js';
import { v2 as cloudinary } from 'cloudinary';

/**
 * @desc    Upload a new photo
 * @route   POST /api/photos/upload
 * @access  Private
 */
export const uploadPhoto = async (req, res) => {
    try {
        const { title, description, location, tags } = req.body;
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a photo to upload"
            });
        }

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Photo title is required"
            });
        }

        // Parse tags if provided
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (error) {
                parsedTags = [];
            }
        }

        // Create photo record
        const photo = new Photo({
            title: title.trim(),
            description: description?.trim() || '',
            imageUrl: req.file.path,
            publicId: req.file.filename,
            uploadedBy: userId,
            location: location?.trim() || '',
            tags: parsedTags,
            fileSize: req.file.bytes,
            dimensions: {
                width: req.file.width,
                height: req.file.height
            },
            format: req.file.format
        });

        await photo.save();

        // Populate user info
        await photo.populate('uploadedBy', 'name email');

        res.status(201).json({
            success: true,
            message: "Photo uploaded successfully",
            photo: photo
        });

    } catch (error) {
        console.error('Photo upload error:', error);
        
        // Clean up uploaded file if database save failed
        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: "Error uploading photo",
            error: error.message
        });
    }
};

/**
 * @desc    Get all photos for homepage
 * @route   GET /api/photos
 * @access  Public
 */
export const getAllPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const photos = await Photo.find({ isApproved: true })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPhotos = await Photo.countDocuments({ isApproved: true });
        const totalPages = Math.ceil(totalPhotos / limit);

        res.json({
            success: true,
            photos: photos,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalPhotos: totalPhotos,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching photos",
            error: error.message
        });
    }
};

/**
 * @desc    Get popular photos (most liked)
 * @route   GET /api/photos/popular
 * @access  Public
 */
export const getPopularPhotos = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const photos = await Photo.find({ isApproved: true })
            .populate('uploadedBy', 'name email')
            .sort({ totalLikes: -1, createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            photos: photos
        });

    } catch (error) {
        console.error('Get popular photos error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching popular photos",
            error: error.message
        });
    }
};

/**
 * @desc    Get user's uploaded photos
 * @route   GET /api/photos/my-photos
 * @access  Private
 */
export const getUserPhotos = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const photos = await Photo.find({ uploadedBy: userId })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPhotos = await Photo.countDocuments({ uploadedBy: userId });
        const totalPages = Math.ceil(totalPhotos / limit);

        res.json({
            success: true,
            photos: photos,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalPhotos: totalPhotos,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get user photos error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching user photos",
            error: error.message
        });
    }
};

/**
 * @desc    Delete a photo
 * @route   DELETE /api/photos/:id
 * @access  Private
 */
export const deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.id;
        const userId = req.user._id;

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found"
            });
        }

        // Check if user owns this photo or is admin
        if (photo.uploadedBy.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this photo"
            });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(photo.publicId);
        } catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
        }

        // Delete from database
        await Photo.findByIdAndDelete(photoId);

        res.json({
            success: true,
            message: "Photo deleted successfully"
        });

    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting photo",
            error: error.message
        });
    }
};

/**
 * @desc    Increment photo views
 * @route   POST /api/photos/:id/view
 * @access  Public
 */
export const incrementPhotoViews = async (req, res) => {
    try {
        const photoId = req.params.id;

        await Photo.findByIdAndUpdate(
            photoId,
            { $inc: { views: 1 } },
            { new: true }
        );

        res.json({
            success: true,
            message: "Photo view incremented"
        });

    } catch (error) {
        console.error('Increment photo views error:', error);
        res.status(500).json({
            success: false,
            message: "Error incrementing photo views",
            error: error.message
        });
    }
};