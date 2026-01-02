import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaStar, FaEdit, FaTrash, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const MyReviews = () => {
    const { user } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        verifiedReviews: 0
    });

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            // Get token from user object in localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;
            
            const response = await axios.get("/api/reviews/my-reviews", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const reviewsData = response.data.data.reviews;
                setReviews(reviewsData);
                
                // Calculate stats
                const totalReviews = reviewsData.length;
                const averageRating = totalReviews > 0 
                    ? (reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
                    : 0;
                const verifiedReviews = reviewsData.filter(review => review.isVerified).length;
                
                setStats({
                    totalReviews,
                    averageRating,
                    verifiedReviews
                });
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            showToast.error("Error loading your reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review._id);
        setEditForm({
            rating: review.rating,
            comment: review.comment
        });
    };

    const handleUpdateReview = async (reviewId) => {
        try {
            // Get token from user object in localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;
            
            const response = await axios.put(`/api/reviews/${reviewId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                showToast.success("Review updated successfully!");
                setEditingReview(null);
                fetchMyReviews(); // Refresh reviews
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error updating review";
            showToast.error(message);
        }
    };

    const handleDeleteReview = async (reviewId, tourTitle) => {
        if (!window.confirm(`Are you sure you want to delete your review for "${tourTitle}"?`)) {
            return;
        }

        try {
            // Get token from user object in localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;
            
            const response = await axios.delete(`/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                showToast.success("Review deleted successfully!");
                fetchMyReviews(); // Refresh reviews
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error deleting review";
            showToast.error(message);
        }
    };

    const renderStars = (rating, isEditable = false, onRatingChange = null) => {
        return (
            <div className="flex items-center space-x-0.5 sm:space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => isEditable && onRatingChange && onRatingChange(star)}
                        className={`${isEditable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} focus:outline-none transition-transform`}
                        disabled={!isEditable}
                    >
                        <FaStar
                            className={`text-sm sm:text-base lg:text-lg ${
                                star <= rating ? "text-yellow-400" : "text-gray-300"
                            } ${isEditable ? 'hover:text-yellow-400' : ''} transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-600 bg-green-50';
        if (rating >= 3.5) return 'text-blue-600 bg-blue-50';
        if (rating >= 2.5) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-4 sm:py-6 lg:py-8">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 sm:w-1/2 lg:w-1/4 mb-4 sm:mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6">
                                    <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6">
                                    <div className="h-4 sm:h-6 bg-gray-200 rounded w-2/3 sm:w-1/3 mb-4"></div>
                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 sm:w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-4 sm:py-6 lg:py-8">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Reviews</h1>
                            <p className="text-sm sm:text-base text-gray-600">Manage and track all your tour reviews</p>
                        </div>
                        <Link 
                            to="/tours" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base"
                        >
                            <span>🔍</span>
                            <span className="hidden xs:inline">Explore Tours</span>
                            <span className="xs:hidden">Tours</span>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Reviews</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaEdit className="text-blue-600 text-lg sm:text-xl" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-500"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                                        <div className="flex items-center mt-1 sm:mt-0">
                                            {renderStars(parseFloat(stats.averageRating))}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <FaStar className="text-yellow-600 text-lg sm:text-xl" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500 sm:col-span-2 lg:col-span-1"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Verified Reviews</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.verifiedReviews}</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-green-600 text-lg sm:text-xl" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 text-center"
                    >
                        <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">⭐</div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No Reviews Yet</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                            You haven't written any reviews yet. Start exploring tours and share your experiences with other travelers!
                        </p>
                        <Link 
                            to="/tours" 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 rounded-lg font-medium transition-all shadow-lg inline-flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base"
                        >
                            <span>🚀</span>
                            <span className="hidden xs:inline">Explore Tours</span>
                            <span className="xs:hidden">Tours</span>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-4 sm:p-6">
                                    {/* Review Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                <Link
                                                    to={`/tour/${review.tour._id}`}
                                                    className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors truncate"
                                                >
                                                    {review.tour.title}
                                                </Link>
                                                {review.isVerified && (
                                                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex-shrink-0">
                                                        <FaCheckCircle className="mr-1" />
                                                        <span className="hidden xs:inline">Verified</span>
                                                        <span className="xs:hidden">✓</span>
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <FaMapMarkerAlt className="flex-shrink-0" />
                                                    <span className="truncate">{review.tour.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <FaCalendarAlt className="flex-shrink-0" />
                                                    <span className="whitespace-nowrap">
                                                        <span className="hidden sm:inline">Reviewed on </span>
                                                        {formatDate(review.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0">
                                            <Link
                                                to={`/tour/${review.tour._id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Tour"
                                            >
                                                <FaEye className="text-sm sm:text-base" />
                                            </Link>
                                            <button
                                                onClick={() => handleEditReview(review)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Review"
                                            >
                                                <FaEdit className="text-sm sm:text-base" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review._id, review.tour.title)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Review"
                                            >
                                                <FaTrash className="text-sm sm:text-base" />
                                            </button>
                                        </div>
                                    </div>

                                    {editingReview === review._id ? (
                                        // Edit Form
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rating
                                                </label>
                                                <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                                                    {renderStars(
                                                        editForm.rating, 
                                                        true, 
                                                        (rating) => setEditForm({ ...editForm, rating })
                                                    )}
                                                    <span className="text-sm text-gray-600">
                                                        {editForm.rating}/5 stars
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Review
                                                </label>
                                                <textarea
                                                    value={editForm.comment}
                                                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                                    className="w-full h-20 sm:h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base"
                                                    maxLength={500}
                                                />
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {editForm.comment.length}/500 characters
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                                                <button
                                                    onClick={() => handleUpdateReview(review._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setEditingReview(null)}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display Review
                                        <div>
                                            {/* Rating */}
                                            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 mb-4">
                                                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                                                    {renderStars(review.rating)}
                                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRatingColor(review.rating)} whitespace-nowrap`}>
                                                        {review.rating}/5 stars
                                                    </span>
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    {review.createdAt !== review.updatedAt && (
                                                        <span className="italic">Edited</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Comment */}
                                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tour Image */}
                                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                    <Link to={`/tour/${review.tour._id}`} className="block">
                                        <img
                                            src={review.tour.image}
                                            alt={review.tour.title}
                                            className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                        />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;