import { useState, useEffect } from "react";
import { FaEye, FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import LikeButton from "./LikeButton";
import { showToast } from "../utils/toast";

const PhotoGallery = ({ refreshTrigger = 0 }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetchPhotos();
    }, [refreshTrigger]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            
            // Get auth token if available
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const token = userData?.token;
            
            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.get('http://localhost:5000/api/photos', {
                headers
            });

            if (response.data.success) {
                setPhotos(response.data.photos);
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
            showToast.error("Error loading photos");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = async (photo) => {
        setSelectedPhoto(photo);
        
        // Increment view count
        try {
            await axios.post(`http://localhost:5000/api/photos/${photo._id}/view`);
        } catch (error) {
            console.error("Error incrementing views:", error);
        }
    };

    const handleLikeChange = (photoId, isLiked, newCount) => {
        setPhotos(prevPhotos =>
            prevPhotos.map(photo =>
                photo._id === photoId
                    ? { ...photo, totalLikes: newCount, isLikedByUser: isLiked }
                    : photo
            )
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
                ))}
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos yet</h3>
                <p className="text-gray-500">Be the first to share your travel memories!</p>
            </div>
        );
    }

    return (
        <>
            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => handlePhotoClick(photo)}
                    >
                        {/* Image */}
                        <div className="relative overflow-hidden">
                            <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            
                            {/* View count overlay */}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                                <FaEye />
                                <span>{photo.views || 0}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                {photo.title}
                            </h3>
                            
                            {photo.description && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {photo.description}
                                </p>
                            )}

                            {/* Location */}
                            {photo.location && (
                                <div className="flex items-center text-gray-500 text-sm mb-3">
                                    <FaMapMarkerAlt className="mr-1" />
                                    <span className="truncate">{photo.location}</span>
                                </div>
                            )}

                            {/* Tags */}
                            {photo.tags && photo.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {photo.tags.slice(0, 3).map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                    {photo.tags.length > 3 && (
                                        <span className="text-gray-500 text-xs">
                                            +{photo.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaUser className="mr-1" />
                                    <span className="truncate">{photo.uploadedBy?.name}</span>
                                </div>
                                
                                <LikeButton
                                    type="photo"
                                    itemId={photo._id}
                                    initialLiked={photo.isLikedByUser}
                                    initialCount={photo.totalLikes}
                                    onLikeChange={(isLiked, newCount) => 
                                        handleLikeChange(photo._id, isLiked, newCount)
                                    }
                                />
                            </div>

                            {/* Date */}
                            <div className="flex items-center text-gray-400 text-xs mt-2">
                                <FaClock className="mr-1" />
                                <span>{formatDate(photo.createdAt)}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <img
                                src={selectedPhoto.imageUrl}
                                alt={selectedPhoto.title}
                                className="w-full max-h-[60vh] object-contain"
                            />
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                {selectedPhoto.title}
                            </h2>
                            
                            {selectedPhoto.description && (
                                <p className="text-gray-600 mb-4">
                                    {selectedPhoto.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center">
                                    <FaUser className="mr-1" />
                                    <span>{selectedPhoto.uploadedBy?.name}</span>
                                </div>
                                
                                {selectedPhoto.location && (
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="mr-1" />
                                        <span>{selectedPhoto.location}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center">
                                    <FaEye className="mr-1" />
                                    <span>{selectedPhoto.views || 0} views</span>
                                </div>
                                
                                <div className="flex items-center">
                                    <FaClock className="mr-1" />
                                    <span>{formatDate(selectedPhoto.createdAt)}</span>
                                </div>
                            </div>

                            {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedPhoto.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-center">
                                <LikeButton
                                    type="photo"
                                    itemId={selectedPhoto._id}
                                    initialLiked={selectedPhoto.isLikedByUser}
                                    initialCount={selectedPhoto.totalLikes}
                                    onLikeChange={(isLiked, newCount) => {
                                        handleLikeChange(selectedPhoto._id, isLiked, newCount);
                                        setSelectedPhoto(prev => ({
                                            ...prev,
                                            totalLikes: newCount,
                                            isLikedByUser: isLiked
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PhotoGallery;