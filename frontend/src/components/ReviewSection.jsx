import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaCheckCircle, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const ReviewSection = ({ tourId, tourTitle }) => {
    const { user } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [hasBooked, setHasBooked] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState({});
    const [existingReview, setExistingReview] = useState(null);

    useEffect(() => {
        fetchReviews();
        if (user) {
            checkCanReview();
        }
    }, [tourId, user]);

    // Listen for custom event to open review form
    useEffect(() => {
        const handleOpenReviewForm = () => {
            setShowReviewForm(true);
        };

        window.addEventListener('openReviewForm', handleOpenReviewForm);
        return () => {
            window.removeEventListener('openReviewForm', handleOpenReviewForm);
        };
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/tour/${tourId}`);
            if (response.data.success) {
                setReviews(response.data.data.reviews);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkCanReview = async () => {
        try {
            // Get token from user object in localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;
            
            if (!token) {
                setCanReview(true); // Allow review for logged in users
                return;
            }
            
            const response = await axios.get(`/api/reviews/can-review/${tourId}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                setCanReview(response.data.canReview);
                setHasBooked(response.data.hasBooked);
                if (!response.data.canReview && response.data.existingReview) {
                    setExistingReview(response.data.existingReview);
                }
            }
        } catch (error) {
            console.error("Error checking review eligibility:", error);
            // If there's an error, allow review anyway for logged in users
            setCanReview(true);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!reviewForm.comment.trim()) {
            showToast.error("Please write a comment");
            return;
        }

        // Get token from user object in localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;
        
        if (!token) {
            showToast.error("Please login to submit a review");
            return;
        }

        setSubmitting(true);
        try {
            const response = await axios.post("/api/reviews", {
                tourId,
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment.trim()
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                showToast.success("Review submitted successfully! 🎉");
                setShowReviewForm(false);
                setReviewForm({ rating: 5, comment: "" });
                setCanReview(false);
                fetchReviews(); // Refresh reviews
                checkCanReview(); // Refresh review status
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error submitting review";
            showToast.error(message);
            console.error("Submit review error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, size = "text-lg") => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className={`${size} text-yellow-400`} />);
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className={`${size} text-gray-300`} />);
        }

        return stars;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="border-b pb-4">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Reviews & Ratings
                    {pagination.totalReviews > 0 && (
                        <span className="text-lg font-normal text-gray-500 ml-2">
                            ({pagination.totalReviews} review{pagination.totalReviews !== 1 ? 's' : ''})
                        </span>
                    )}
                </h2>

                {user && (
                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        data-review-btn
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors flex items-center space-x-1 sm:space-x-2 shadow-lg text-xs sm:text-sm lg:text-base"
                    >
                        <FaEdit className="text-xs sm:text-sm" />
                        <span className="hidden xs:inline">{showReviewForm ? 'Cancel Review' : 'Write Review'}</span>
                        <span className="xs:hidden">{showReviewForm ? 'Cancel' : 'Review'}</span>
                    </button>
                )}
            </div>

            {/* Login Prompt for Non-Users */}
            {!user && (
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-center">
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Experience</h3>
                    <p className="text-blue-800 mb-4">
                        Help other travelers by sharing your thoughts about this tour
                    </p>
                    <a 
                        href="/login" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 rounded-lg font-medium transition-colors inline-block shadow-lg text-xs sm:text-sm lg:text-base"
                    >
                        <span className="hidden xs:inline">Login to Write Review</span>
                        <span className="xs:hidden">Login</span>
                    </a>
                </div>
            )}

            {/* Review Form */}
            <AnimatePresence>
                {showReviewForm && user && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg"
                    >
                        <div className="flex items-center mb-4">
                            <div className="text-2xl mr-3">✍️</div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Share Your Experience with {tourTitle}
                            </h3>
                        </div>
                        
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            {/* Rating Section */}
                            <div className="bg-white p-4 rounded-lg border">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    How would you rate this tour? ⭐
                                </label>
                                <div className="flex items-center space-x-2 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            className="focus:outline-none hover:scale-125 transition-transform p-1"
                                        >
                                            <FaStar
                                                className={`text-4xl ${
                                                    star <= reviewForm.rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                } hover:text-yellow-400 transition-colors cursor-pointer`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="text-lg font-medium text-gray-700">
                                    {reviewForm.rating === 1 && "😞 Poor - Not recommended"}
                                    {reviewForm.rating === 2 && "😐 Fair - Below expectations"}
                                    {reviewForm.rating === 3 && "🙂 Good - Met expectations"}
                                    {reviewForm.rating === 4 && "😊 Very Good - Exceeded expectations"}
                                    {reviewForm.rating === 5 && "🤩 Excellent - Outstanding experience!"}
                                </div>
                            </div>

                            {/* Comment Section */}
                            <div className="bg-white p-4 rounded-lg border">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tell us about your experience 📝
                                    {hasBooked && (
                                        <span className="ml-2 inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            <FaCheckCircle className="mr-1" />
                                            Verified Purchase
                                        </span>
                                    )}
                                </label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    placeholder={`What did you love about ${tourTitle}? Share details about the experience, guide, locations, food, accommodation, or anything that would help other travelers make their decision...`}
                                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
                                    maxLength={500}
                                    required
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-gray-500">
                                        {reviewForm.comment.length}/500 characters
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {hasBooked ? "✅ Verified review" : "📝 Public review"}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex space-x-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || !reviewForm.comment.trim()}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Submitting Review...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🚀</span>
                                            <span>Submit Review</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to review this amazing tour!</p>
                    {user && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            data-review-btn
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 rounded-lg font-medium transition-all shadow-lg text-xs sm:text-sm lg:text-base"
                        >
                            <span className="hidden xs:inline">Write First Review ✨</span>
                            <span className="xs:hidden">Review ✨</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-white text-lg" />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {review.user?.name || "Anonymous User"}
                                            </h4>
                                            {review.isVerified && (
                                                <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    <FaCheckCircle className="mr-1" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center mr-3">
                                            {renderStars(review.rating, "text-xl")}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-700">
                                            {review.rating}/5 stars
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed text-base bg-white p-4 rounded-lg border">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {pagination.hasNextPage && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => {
                            // Implement load more functionality
                            console.log("Load more reviews");
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 rounded-lg font-medium transition-colors shadow-lg text-xs sm:text-sm lg:text-base"
                    >
                        <span className="hidden xs:inline">Load More Reviews</span>
                        <span className="xs:hidden">Load More</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;