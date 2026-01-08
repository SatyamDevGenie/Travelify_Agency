import Tour from '../models/tourModel.js';
import Video from '../models/videoModel.js';
import Photo from '../models/photoModel.js';

/**
 * @desc    Toggle like on tour
 * @route   POST /api/likes/tour/:id
 * @access  Private
 */
export const toggleTourLike = async (req, res) => {
    try {
        const tourId = req.params.id;
        const userId = req.user._id;

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        // Check if user already liked this tour
        const existingLikeIndex = tour.likes.findIndex(
            like => like.user.toString() === userId.toString()
        );

        if (existingLikeIndex > -1) {
            // Unlike - remove the like
            tour.likes.splice(existingLikeIndex, 1);
            tour.totalLikes = Math.max(0, tour.totalLikes - 1);
            
            await tour.save();
            
            return res.json({
                success: true,
                message: "Tour unliked successfully",
                isLiked: false,
                totalLikes: tour.totalLikes
            });
        } else {
            // Like - add the like
            tour.likes.push({ user: userId });
            tour.totalLikes += 1;
            
            await tour.save();
            
            return res.json({
                success: true,
                message: "Tour liked successfully",
                isLiked: true,
                totalLikes: tour.totalLikes
            });
        }

    } catch (error) {
        console.error('Toggle tour like error:', error);
        res.status(500).json({
            success: false,
            message: "Error toggling tour like",
            error: error.message
        });
    }
};

/**
 * @desc    Toggle like on video
 * @route   POST /api/likes/video/:id
 * @access  Private
 */
export const toggleVideoLike = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user._id;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        // Check if user already liked this video
        const existingLikeIndex = video.likes.findIndex(
            like => like.toString() === userId.toString()
        );

        if (existingLikeIndex > -1) {
            // Unlike - remove the like
            video.likes.splice(existingLikeIndex, 1);
            video.totalLikes = Math.max(0, video.totalLikes - 1);
            
            await video.save();
            
            return res.json({
                success: true,
                message: "Video unliked successfully",
                isLiked: false,
                totalLikes: video.totalLikes
            });
        } else {
            // Like - add the like
            video.likes.push(userId);
            video.totalLikes += 1;
            
            await video.save();
            
            return res.json({
                success: true,
                message: "Video liked successfully",
                isLiked: true,
                totalLikes: video.totalLikes
            });
        }

    } catch (error) {
        console.error('Toggle video like error:', error);
        res.status(500).json({
            success: false,
            message: "Error toggling video like",
            error: error.message
        });
    }
};

/**
 * @desc    Toggle like on photo
 * @route   POST /api/likes/photo/:id
 * @access  Private
 */
export const togglePhotoLike = async (req, res) => {
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

        // Check if user already liked this photo
        const existingLikeIndex = photo.likes.findIndex(
            like => like.user.toString() === userId.toString()
        );

        if (existingLikeIndex > -1) {
            // Unlike - remove the like
            photo.likes.splice(existingLikeIndex, 1);
            photo.totalLikes = Math.max(0, photo.totalLikes - 1);
            
            await photo.save();
            
            return res.json({
                success: true,
                message: "Photo unliked successfully",
                isLiked: false,
                totalLikes: photo.totalLikes
            });
        } else {
            // Like - add the like
            photo.likes.push({ user: userId });
            photo.totalLikes += 1;
            
            await photo.save();
            
            return res.json({
                success: true,
                message: "Photo liked successfully",
                isLiked: true,
                totalLikes: photo.totalLikes
            });
        }

    } catch (error) {
        console.error('Toggle photo like error:', error);
        res.status(500).json({
            success: false,
            message: "Error toggling photo like",
            error: error.message
        });
    }
};

/**
 * @desc    Get user's liked items
 * @route   GET /api/likes/user
 * @access  Private
 */
export const getUserLikes = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get liked tours
        const likedTours = await Tour.find({
            'likes.user': userId
        }).select('_id title location price image totalLikes');

        // Get liked videos
        const likedVideos = await Video.find({
            likes: userId
        }).select('_id title videoUrl thumbnailUrl totalLikes');

        // Get liked photos
        const likedPhotos = await Photo.find({
            'likes.user': userId
        }).select('_id title imageUrl totalLikes');

        res.json({
            success: true,
            data: {
                tours: likedTours,
                videos: likedVideos,
                photos: likedPhotos
            }
        });

    } catch (error) {
        console.error('Get user likes error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching user likes",
            error: error.message
        });
    }
};