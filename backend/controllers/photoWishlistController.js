import PhotoWishlist from "../models/photoWishlistModel.js";
import Image from "../models/imageModel.js";

/**
 * @desc    Add photo to wishlist
 * @route   POST /api/photo-wishlist/:imageId
 * @access  Private
 */
export const addPhotoToWishlist = async (req, res) => {
    try {
        const { imageId } = req.params;
        const userId = req.user._id;

        // Check if image exists
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Photo not found"
            });
        }

        // Check if already in wishlist
        const existingWishlist = await PhotoWishlist.findOne({
            user: userId,
            image: imageId
        });

        if (existingWishlist) {
            return res.status(400).json({
                success: false,
                message: "Photo already in wishlist"
            });
        }

        // Add to wishlist
        const wishlistItem = new PhotoWishlist({
            user: userId,
            image: imageId
        });

        await wishlistItem.save();

        res.status(201).json({
            success: true,
            message: "Photo added to wishlist successfully",
            data: wishlistItem
        });

    } catch (error) {
        console.error("Error adding photo to wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error adding photo to wishlist",
            error: error.message
        });
    }
};

/**
 * @desc    Remove photo from wishlist
 * @route   DELETE /api/photo-wishlist/:imageId
 * @access  Private
 */
export const removePhotoFromWishlist = async (req, res) => {
    try {
        const { imageId } = req.params;
        const userId = req.user._id;

        const wishlistItem = await PhotoWishlist.findOneAndDelete({
            user: userId,
            image: imageId
        });

        if (!wishlistItem) {
            return res.status(404).json({
                success: false,
                message: "Photo not found in wishlist"
            });
        }

        res.json({
            success: true,
            message: "Photo removed from wishlist successfully"
        });

    } catch (error) {
        console.error("Error removing photo from wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error removing photo from wishlist",
            error: error.message
        });
    }
};

/**
 * @desc    Get user's photo wishlist
 * @route   GET /api/photo-wishlist
 * @access  Private
 */
export const getPhotoWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Get wishlist with image details
        const wishlistItems = await PhotoWishlist.find({ user: userId })
            .populate({
                path: 'image',
                select: 'title description imageUrl location tags totalLikes uploadedBy createdAt',
                populate: {
                    path: 'uploadedBy',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Filter out items where image might have been deleted
        const validWishlistItems = wishlistItems.filter(item => item.image);

        // Get total count for pagination
        const totalItems = await PhotoWishlist.countDocuments({ user: userId });

        res.json({
            success: true,
            data: {
                wishlist: validWishlistItems,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalItems / limit),
                    totalItems,
                    hasNextPage: page < Math.ceil(totalItems / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching photo wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching photo wishlist",
            error: error.message
        });
    }
};

/**
 * @desc    Check if photo is in user's wishlist
 * @route   GET /api/photo-wishlist/check/:imageId
 * @access  Private
 */
export const checkPhotoWishlistStatus = async (req, res) => {
    try {
        const { imageId } = req.params;
        const userId = req.user._id;

        const wishlistItem = await PhotoWishlist.findOne({
            user: userId,
            image: imageId
        });

        res.json({
            success: true,
            data: {
                isInWishlist: !!wishlistItem
            }
        });

    } catch (error) {
        console.error("Error checking photo wishlist status:", error);
        res.status(500).json({
            success: false,
            message: "Error checking photo wishlist status",
            error: error.message
        });
    }
};