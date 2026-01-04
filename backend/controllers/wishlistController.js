import Wishlist from "../models/wishlistModel.js";
import Tour from "../models/tourModel.js";

/**
 * @desc    Add tour to wishlist
 * @route   POST /api/wishlist/:tourId
 * @access  Private
 */
export const addToWishlist = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user._id;

        // Check if tour exists
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        // Check if already in wishlist
        const existingWishlist = await Wishlist.findOne({
            user: userId,
            tour: tourId
        });

        if (existingWishlist) {
            return res.status(400).json({
                success: false,
                message: "Tour already in wishlist"
            });
        }

        // Add to wishlist
        const wishlistItem = new Wishlist({
            user: userId,
            tour: tourId
        });

        await wishlistItem.save();

        res.status(201).json({
            success: true,
            message: "Tour added to wishlist successfully",
            data: wishlistItem
        });

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error adding tour to wishlist",
            error: error.message
        });
    }
};

/**
 * @desc    Remove tour from wishlist
 * @route   DELETE /api/wishlist/:tourId
 * @access  Private
 */
export const removeFromWishlist = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user._id;

        const wishlistItem = await Wishlist.findOneAndDelete({
            user: userId,
            tour: tourId
        });

        if (!wishlistItem) {
            return res.status(404).json({
                success: false,
                message: "Tour not found in wishlist"
            });
        }

        res.json({
            success: true,
            message: "Tour removed from wishlist successfully"
        });

    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error removing tour from wishlist",
            error: error.message
        });
    }
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Get wishlist with tour details
        const wishlistItems = await Wishlist.find({ user: userId })
            .populate({
                path: 'tour',
                select: 'title description price location image duration availableSlots averageRating totalReviews'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Filter out items where tour might have been deleted
        const validWishlistItems = wishlistItems.filter(item => item.tour);

        // Get total count for pagination
        const totalItems = await Wishlist.countDocuments({ user: userId });

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
        console.error("Error fetching wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching wishlist",
            error: error.message
        });
    }
};

/**
 * @desc    Check if tour is in user's wishlist
 * @route   GET /api/wishlist/check/:tourId
 * @access  Private
 */
export const checkWishlistStatus = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user._id;

        const wishlistItem = await Wishlist.findOne({
            user: userId,
            tour: tourId
        });

        res.json({
            success: true,
            data: {
                isInWishlist: !!wishlistItem
            }
        });

    } catch (error) {
        console.error("Error checking wishlist status:", error);
        res.status(500).json({
            success: false,
            message: "Error checking wishlist status",
            error: error.message
        });
    }
};

/**
 * @desc    Get wishlist count for user
 * @route   GET /api/wishlist/count
 * @access  Private
 */
export const getWishlistCount = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const count = await Wishlist.countDocuments({ user: userId });

        res.json({
            success: true,
            data: {
                count
            }
        });

    } catch (error) {
        console.error("Error getting wishlist count:", error);
        res.status(500).json({
            success: false,
            message: "Error getting wishlist count",
            error: error.message
        });
    }
};