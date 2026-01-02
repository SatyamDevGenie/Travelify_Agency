import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaUser, FaMapMarkerAlt, FaTag, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const ImageGallery = ({ refreshTrigger }) => {
    const { user } = useSelector((state) => state.auth);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchImages();
    }, [refreshTrigger]);

    const fetchImages = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12"
            });

            const response = await axios.get(`/api/images?${params}`);
            
            if (response.data.success) {
                if (page === 1) {
                    setImages(response.data.data.images);
                } else {
                    setImages(prev => [...prev, ...response.data.data.images]);
                }
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            showToast.error("Error loading images");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (imageId) => {
        if (!user) {
            showToast.error("Please login to like images");
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const response = await axios.post(`/api/images/${imageId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setImages(prev => prev.map(img => 
                    img._id === imageId 
                        ? { 
                            ...img, 
                            totalLikes: response.data.data.totalLikes,
                            likes: response.data.data.liked 
                                ? [...img.likes, user._id]
                                : img.likes.filter(id => id !== user._id)
                        }
                        : img
                ));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            showToast.error("Error updating like");
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
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Image */}
                        <div className="lg:w-2/3">
                            <img
                                src={image.imageUrl}
                                alt={image.title}
                                className="w-full h-64 lg:h-96 object-cover"
                            />
                        </div>
                        
                        {/* Details */}
                        <div className="lg:w-1/3 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">{image.title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
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
                                <button
                                    onClick={() => handleLike(image._id)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    {user && image.likes?.includes(user._id) ? (
                                        <FaHeart className="text-red-500" />
                                    ) : (
                                        <FaRegHeart />
                                    )}
                                    <span>{image.totalLikes || 0}</span>
                                </button>
                                
                                <div className="text-sm text-gray-500">
                                    {image.dimensions?.width} × {image.dimensions?.height}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    if (loading && images.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {/* Images Grid */}
            {images.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No photos yet</h3>
                    <p className="text-gray-500">Be the first to share your travel memories!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((image, index) => (
                        <motion.div
                            key={image._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="relative">
                                <img
                                    src={image.imageUrl}
                                    alt={image.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                    <FaEye className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLike(image._id);
                                        }}
                                        className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                                    >
                                        {user && image.likes?.includes(user._id) ? (
                                            <FaHeart className="text-red-500" />
                                        ) : (
                                            <FaRegHeart className="text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 truncate">{image.title}</h3>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                    <FaUser className="text-xs" />
                                    <span>{image.uploadedBy?.name}</span>
                                </div>

                                {image.location && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                        <FaMapMarkerAlt className="text-xs" />
                                        <span className="truncate">{image.location}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                        <FaHeart className="text-red-500" />
                                        <span>{image.totalLikes || 0}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(image.createdAt)}
                                    </span>
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
                        onClick={() => fetchImages(pagination.currentPage + 1)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                        {loading ? "Loading..." : "Load More Photos"}
                    </button>
                </div>
            )}

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

export default ImageGallery;