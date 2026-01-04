import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaUser, FaMapMarkerAlt, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import { showToast } from "../utils/toast";

const SavedPhotos = () => {
    const { user } = useSelector((state) => state.auth);
    const [savedPhotos, setSavedPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    // Get user token helper
    const getUserToken = () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        return userData?.token;
    };

    useEffect(() => {
        if (user) {
            fetchSavedPhotos();
        }
    }, [user]);

    const fetchSavedPhotos = async (page = 1) => {
        try {
            setLoading(true);
            const token = getUserToken();
            const response = await axios.get(`/api/photo-wishlist?page=${page}&limit=12`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                if (page === 1) {
                    setSavedPhotos(response.data.data.wishlist);
                } else {
                    setSavedPhotos(prev => [...prev, ...response.data.data.wishlist]);
                }
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching saved photos:", error);
            showToast.error("Error loading saved photos");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (pagination.hasNextPage) {
            fetchSavedPhotos(pagination.currentPage + 1);
        }
    };

    const handleRemovePhoto = async (imageId, imageTitle) => {
        try {
            const token = getUserToken();
            await axios.delete(`/api/photo-wishlist/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSavedPhotos(prev => prev.filter(item => item.image._id !== imageId));
            showToast.success(`${imageTitle} removed from saved photos`);
        } catch (error) {
            showToast.error("Failed to remove photo");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const ImageModal = ({ image, onClose }) => {
        if (!image) return null;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[90vh]">
                        {/* Image */}
                        <div className="lg:w-2/3 flex-shrink-0">
                            <img
                                src={image.imageUrl}
                                alt={image.title}
                                className="w-full h-48 sm:h-64 lg:h-96 object-cover"
                            />
                        </div>
                        
                        {/* Details */}
                        <div className="lg:w-1/3 p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-2 line-clamp-2">{image.title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white text-sm" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{image.uploadedBy?.name}</p>
                                    <p className="text-sm text-gray-500">{formatDate(image.createdAt)}</p>
                                </div>
                            </div>

                            {image.description && (
                                <p className="text-gray-700 leading-relaxed">{image.description}</p>
                            )}

                            {image.location && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaMapMarkerAlt />
                                    <span>{image.location}</span>
                                </div>
                            )}

                            {image.tags && image.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {image.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaHeart className="text-red-500" />
                                    <span>{image.totalLikes || 0} likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to view your saved photos</p>
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

    if (loading && savedPhotos.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Saved Photos</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Your saved travel photos</p>
                    </div>
                    
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-xl h-40 sm:h-48 mb-3 sm:mb-4"></div>
                                <div className="px-2">
                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                            <FaHeart className="text-2xl sm:text-3xl text-red-500" />
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Saved Photos</h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-600 px-4">
                            {savedPhotos.length > 0 
                                ? `${savedPhotos.length} saved photo${savedPhotos.length > 1 ? 's' : ''}`
                                : "Your saved travel photos will appear here"
                            }
                        </p>
                    </motion.div>
                </div>

                {/* Photos Content */}
                {savedPhotos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12 sm:py-16 px-4"
                    >
                        <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📸</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No saved photos yet</h3>
                        <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                            Start exploring travel photos and save your favorites by clicking the heart icon
                        </p>
                        <Link
                            to="/"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 text-sm sm:text-base"
                        >
                            <span>Explore Photos</span>
                            <span>📷</span>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Photos Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                            {savedPhotos.map((item, index) => {
                                const image = item.image;
                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={image.imageUrl}
                                                alt={image.title}
                                                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <FaEye className="text-white text-xl sm:text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            
                                            {/* Delete Button */}
                                            <div className="absolute top-2 right-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemovePhoto(image._id, image.title);
                                                    }}
                                                    className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    title="Remove from saved photos"
                                                >
                                                    <FaTrash className="text-xs sm:text-sm" />
                                                </motion.button>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 sm:p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 truncate text-sm sm:text-base">{image.title}</h3>
                                            
                                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                                                <FaUser className="text-xs flex-shrink-0" />
                                                <span className="truncate">{image.uploadedBy?.name}</span>
                                            </div>

                                            {image.location && (
                                                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                                                    <FaMapMarkerAlt className="text-xs flex-shrink-0" />
                                                    <span className="truncate">{image.location}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                                                    <FaHeart className="text-red-500 text-xs" />
                                                    <span>{image.totalLikes || 0}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 truncate ml-2">
                                                    {formatDate(item.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {pagination.hasNextPage && (
                            <div className="text-center mt-6 sm:mt-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                >
                                    {loading ? "Loading..." : "Load More Photos"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default SavedPhotos;