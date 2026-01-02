import Review from "../models/reviewModel.js";
import Tour from "../models/tourModel.js";
import Booking from "../models/bookingModel.js";

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res) => {
    try {
        const { tourId, rating, comment } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!tourId || !rating || !comment) {
            return res.status(400).json({ 
                message: "Tour ID, rating, and comment are required" 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                message: "Rating must be between 1 and 5" 
            });
        }

        // Check if tour exists
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Check if user has already reviewed this tour
        const existingReview = await Review.findOne({ tour: tourId, user: userId });
        if (existingReview) {
            return res.status(400).json({ 
                message: "You have already reviewed this tour" 
            });
        }

        // Check if user has booked this tour (for verified reviews)
        const hasBooked = await Booking.findOne({ 
            tour: tourId, 
            user: userId, 
            bookingStatus: "confirmed" 
        });

        // Create review
        const review = new Review({
            tour: tourId,
            user: userId,
            rating: parseInt(rating),
            comment: comment.trim(),
            isVerified: !!hasBooked
        });

        await review.save();

        // Update tour's average rating and review count
        await updateTourRating(tourId);

        // Populate user details for response
        await review.populate('user', 'name');

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ 
            message: "Error creating review", 
            error: error.message 
        });
    }
};

/**
 * @desc    Get reviews for a tour
 * @route   GET /api/reviews/tour/:tourId
 * @access  Public
 */
export const getTourReviews = async (req, res) => {
    try {
        const { tourId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get reviews with user details
        const reviews = await Review.find({ tour: tourId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalReviews = await Review.countDocuments({ tour: tourId });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNextPage: page < Math.ceil(totalReviews / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching tour reviews:", error);
        res.status(500).json({ 
            message: "Error fetching reviews", 
            error: error.message 
        });
    }
};

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
export const getMyReviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ user: userId })
            .populate('tour', 'title location image price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments({ user: userId });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNextPage: page < Math.ceil(totalReviews / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({ 
            message: "Error fetching your reviews", 
            error: error.message 
        });
    }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if user owns this review
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ 
                message: "You can only update your own reviews" 
            });
        }

        // Validate input
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ 
                message: "Rating must be between 1 and 5" 
            });
        }

        // Update review
        if (rating) review.rating = parseInt(rating);
        if (comment) review.comment = comment.trim();

        await review.save();

        // Update tour's average rating
        await updateTourRating(review.tour);

        // Populate user details for response
        await review.populate('user', 'name');

        res.json({
            success: true,
            message: "Review updated successfully",
            data: review
        });

    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ 
            message: "Error updating review", 
            error: error.message 
        });
    }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if user owns this review or is admin
        if (review.user.toString() !== userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({ 
                message: "You can only delete your own reviews" 
            });
        }

        const tourId = review.tour;
        await Review.findByIdAndDelete(id);

        // Update tour's average rating
        await updateTourRating(tourId);

        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ 
            message: "Error deleting review", 
            error: error.message 
        });
    }
};

/**
 * @desc    Check if user can review a tour
 * @route   GET /api/reviews/can-review/:tourId
 * @access  Private
 */
export const canReviewTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user._id;

        // Check if tour exists
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Check if user has already reviewed
        const existingReview = await Review.findOne({ tour: tourId, user: userId });
        if (existingReview) {
            return res.json({
                success: true,
                canReview: false,
                reason: "already_reviewed",
                message: "You have already reviewed this tour",
                existingReview
            });
        }

        // Check if user has booked this tour
        const hasBooked = await Booking.findOne({ 
            tour: tourId, 
            user: userId, 
            bookingStatus: "confirmed" 
        });

        res.json({
            success: true,
            canReview: true,
            hasBooked: !!hasBooked,
            message: hasBooked ? 
                "You can write a verified review" : 
                "You can write a review (unverified)"
        });

    } catch (error) {
        console.error("Error checking review eligibility:", error);
        res.status(500).json({ 
            message: "Error checking review eligibility", 
            error: error.message 
        });
    }
};

/**
 * Helper function to update tour's average rating and review count
 */
const updateTourRating = async (tourId) => {
    try {
        const reviews = await Review.find({ tour: tourId });
        
        if (reviews.length === 0) {
            await Tour.findByIdAndUpdate(tourId, {
                averageRating: 0,
                totalReviews: 0
            });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal

        await Tour.findByIdAndUpdate(tourId, {
            averageRating,
            totalReviews: reviews.length
        });

    } catch (error) {
        console.error("Error updating tour rating:", error);
    }
};