import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaTrash } from "react-icons/fa";
import { getWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { showToast } from "../utils/toast";
import WishlistButton from "../components/WishlistButton";

const Wishlist = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { wishlist, loading, pagination } = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (user) {
            dispatch(getWishlist());
        }
    }, [dispatch, user]);

    const handleLoadMore = () => {
        if (pagination.hasNextPage) {
            dispatch(getWishlist({ page: pagination.currentPage + 1 }));
        }
    };

    const handleRemoveFromWishlist = async (tourId, tourTitle) => {
        try {
            await dispatch(removeFromWishlist(tourId)).unwrap();
            showToast.success(`${tourTitle} removed from wishlist`);
        } catch (error) {
            showToast.error(error || "Failed to remove from wishlist");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to view your wishlist</p>
                    <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-fluid">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                        <p className="text-gray-600">Your saved tours</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-fluid">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <FaHeart className="text-3xl text-red-500" />
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Wishlist</h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            {wishlist.length > 0 
                                ? `${wishlist.length} saved tour${wishlist.length > 1 ? 's' : ''}`
                                : "Your saved tours will appear here"
                            }
                        </p>
                    </motion.div>
                </div>

                {/* Wishlist Content */}
                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-16"
                    >
                        <div className="text-8xl mb-6">💔</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start exploring our amazing tours and save your favorites by clicking the heart icon
                        </p>
                        <Link
                            to="/tours"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                        >
                            <span>Explore Tours</span>
                            <span>🌟</span>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Tours Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.map((item, index) => {
                                const tour = item.tour;
                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={tour.image || "/api/placeholder/400/300"}
                                                alt={tour.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            
                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                            
                                            {/* Wishlist Button */}
                                            <div className="absolute top-4 right-4">
                                                <WishlistButton tourId={tour._id} size="sm" />
                                            </div>

                                            {/* Quick Remove Button */}
                                            <div className="absolute top-4 left-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleRemoveFromWishlist(tour._id, tour.title)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    title="Remove from wishlist"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </motion.button>
                                            </div>

                                            {/* Price Badge */}
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-white bg-opacity-95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ₹{tour.price?.toLocaleString("en-IN")}
                                                    </span>
                                                    <span className="text-sm text-gray-600 ml-1">per person</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {tour.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                {tour.description}
                                            </p>

                                            {/* Tour Details Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaMapMarkerAlt className="mr-2 text-blue-500 flex-shrink-0" />
                                                    <span className="truncate">{tour.location}</span>
                                                </div>
                                                
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaClock className="mr-2 text-green-500 flex-shrink-0" />
                                                    <span>{tour.duration}</span>
                                                </div>
                                                
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaUsers className="mr-2 text-purple-500 flex-shrink-0" />
                                                    <span>{tour.availableSlots} slots left</span>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center text-sm">
                                                    {tour.averageRating > 0 ? (
                                                        <>
                                                            <FaStar className="mr-1 text-yellow-500" />
                                                            <span className="font-medium">{tour.averageRating.toFixed(1)}</span>
                                                            <span className="text-gray-500 ml-1">
                                                                ({tour.totalReviews})
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">No reviews yet</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <Link
                                                to={`/tour/${tour._id}`}
                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                            >
                                                <span>👁️</span>
                                                <span>View Details</span>
                                            </Link>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 pb-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="text-xs text-gray-500">
                                                    <span className="font-medium">Added:</span> {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                    <FaHeart className="text-red-400" />
                                                    <span>Saved</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {pagination.hasNextPage && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? "Loading..." : "Load More Tours"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;