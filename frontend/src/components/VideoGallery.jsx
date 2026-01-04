import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaMapMarkerAlt, FaPlay, FaEye, FaHeart, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const VideoGallery = ({ refreshTrigger }) => {
    const { user } = useSelector((state) => state.auth);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchVideos();
    }, [refreshTrigger]);

    const fetchVideos = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12"
            });

            const response = await axios.get(`/api/videos?${params}`);
            
            if (response.data.success) {
                if (page === 1) {
                    setVideos(response.data.data.videos);
                } else {
                    setVideos(prev => [...prev, ...response.data.data.videos]);
                }
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            showToast.error("Error loading videos");
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = async (video) => {
        setSelectedVideo(video);
        
        // Increment view count
        try {
            await axios.post(`/api/videos/${video._id}/view`);
            // Update local state
            setVideos(prev => prev.map(v => 
                v._id === video._id 
                    ? { ...v, views: (v.views || 0) + 1 }
                    : v
            ));
        } catch (error) {
            console.error("Error incrementing views:", error);
        }
    };

    const handleLike = async (videoId, e) => {
        e.stopPropagation();
        
        if (!user) {
            showToast.error("Please login to like videos");
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const response = await axios.post(`/api/videos/${videoId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Update local state
                setVideos(prev => prev.map(video => 
                    video._id === videoId 
                        ? { 
                            ...video, 
                            totalLikes: response.data.data.totalLikes,
                            likes: response.data.data.liked 
                                ? [...(video.likes || []), user._id]
                                : (video.likes || []).filter(id => id !== user._id)
                        }
                        : video
                ));
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error updating like";
            showToast.error(message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const VideoModal = ({ video, onClose }) => {
        if (!video) return null;

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
                    className="bg-white rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Video Player */}
                        <div className="lg:w-2/3">
                            <video
                                src={video.videoUrl}
                                className="w-full h-64 lg:h-96 object-cover"
                                controls
                                autoPlay
                                preload="metadata"
                            />
                        </div>
                        
                        {/* Details */}
                        <div className="lg:w-1/3 p-6 space-y-4 max-h-96 overflow-y-auto">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 pr-4">{video.title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white text-sm" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{video.uploadedBy?.name}</p>
                                    <p className="text-sm text-gray-500">{formatDate(video.createdAt)}</p>
                                </div>
                            </div>

                            {video.description && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                    <p className="text-gray-700 leading-relaxed text-sm">{video.description}</p>
                                </div>
                            )}

                            {video.location && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaMapMarkerAlt />
                                    <span className="text-sm">{video.location}</span>
                                </div>
                            )}

                            {video.tags && video.tags.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {video.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                                        <FaHeart />
                                        <span>{video.totalLikes || 0}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Likes</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                                        <FaEye />
                                        <span>{video.views || 0}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Views</p>
                                </div>
                            </div>

                            {video.duration && (
                                <div className="text-center text-sm text-gray-500">
                                    Duration: {formatDuration(video.duration)}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    if (loading && videos.length === 0) {
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
            {/* Videos Grid */}
            {videos.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎥</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No videos yet</h3>
                    <p className="text-gray-500">Be the first to share your travel videos!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative">
                                <video
                                    src={video.videoUrl}
                                    className="w-full h-48 object-cover"
                                    preload="metadata"
                                    muted
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                    <FaPlay className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                
                                {/* Duration Badge */}
                                {video.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                                        <FaClock />
                                        <span>{formatDuration(video.duration)}</span>
                                    </div>
                                )}

                                {/* Like Button */}
                                <button
                                    onClick={(e) => handleLike(video._id, e)}
                                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                                        user && video.likes?.includes(user._id)
                                            ? "bg-red-500 text-white"
                                            : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
                                    }`}
                                >
                                    <FaHeart className="text-sm" />
                                </button>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 truncate">{video.title}</h3>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                    <FaUser className="text-xs" />
                                    <span>{video.uploadedBy?.name}</span>
                                </div>

                                {video.location && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                        <FaMapMarkerAlt className="text-xs" />
                                        <span className="truncate">{video.location}</span>
                                    </div>
                                )}

                                {video.description && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {video.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-3">
                                        <span className="flex items-center space-x-1">
                                            <FaHeart />
                                            <span>{video.totalLikes || 0}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <FaEye />
                                            <span>{video.views || 0}</span>
                                        </span>
                                    </div>
                                    <span>{formatDate(video.createdAt)}</span>
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
                        onClick={() => fetchVideos(pagination.currentPage + 1)}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                        {loading ? "Loading..." : "Load More Videos"}
                    </button>
                </div>
            )}

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </div>
    );
};

export default VideoGallery;