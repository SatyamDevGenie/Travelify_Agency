import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaCamera, FaVideo, FaUpload, FaTrash, FaHeart, FaCalendar, FaMapMarkerAlt, FaEye, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";
import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";

const MyPhotos = () => {
    const { user } = useSelector((state) => state.auth);
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showVideoUpload, setShowVideoUpload] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeTab, setActiveTab] = useState("photos");
    const [stats, setStats] = useState({
        totalImages: 0,
        totalVideos: 0,
        totalLikes: 0,
        totalViews: 0
    });

    useEffect(() => {
        if (user) {
            fetchMyMedia();
        }
    }, [user]);

    const fetchMyMedia = async () => {
        try {
            setLoading(true);
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const [imagesResponse, videosResponse] = await Promise.all([
                axios.get("/api/images/my-images", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("/api/videos/my-videos", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (imagesResponse.data.success) {
                setImages(imagesResponse.data.data.images);
            }

            if (videosResponse.data.success) {
                setVideos(videosResponse.data.data.videos);
            }

            // Calculate stats
            const totalImages = imagesResponse.data.data.images.length;
            const totalVideos = videosResponse.data.data.videos.length;
            const totalLikes = [
                ...imagesResponse.data.data.images,
                ...videosResponse.data.data.videos
            ].reduce((sum, item) => sum + (item.totalLikes || 0), 0);
            const totalViews = videosResponse.data.data.videos.reduce((sum, video) => sum + (video.views || 0), 0);

            setStats({ totalImages, totalVideos, totalLikes, totalViews });

        } catch (error) {
            console.error("Error fetching media:", error);
            showToast.error("Error loading your media");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const endpoint = type === "image" ? `/api/images/${id}` : `/api/videos/${id}`;
            
            await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showToast.success(`${type === "image" ? "Photo" : "Video"} deleted successfully`);
            
            // Remove from local state
            if (type === "image") {
                setImages(prev => prev.filter(img => img._id !== id));
                setStats(prev => ({ ...prev, totalImages: prev.totalImages - 1 }));
            } else {
                setVideos(prev => prev.filter(vid => vid._id !== id));
                setStats(prev => ({ ...prev, totalVideos: prev.totalVideos - 1 }));
            }

        } catch (error) {
            const message = error.response?.data?.message || `Error deleting ${type}`;
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
                        <div className="lg:w-1/3 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">{video.title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {video.description && (
                                <p className="text-gray-700 leading-relaxed">{video.description}</p>
                            )}

                            {video.location && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaMapMarkerAlt />
                                    <span>{video.location}</span>
                                </div>
                            )}

                            {video.tags && video.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {video.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-sm text-gray-600">
                                    {video.totalLikes || 0} likes • {video.views || 0} views
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    {formatDate(video.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
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
                                <div className="text-sm text-gray-600">
                                    {image.totalLikes || 0} likes
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    {formatDate(image.createdAt)}
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your photos</p>
                    <a
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-fluid">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Photos & Videos</h1>
                            <p className="text-gray-600">Manage your uploaded travel photos and videos</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                            <button
                                onClick={() => setShowImageUpload(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm sm:text-base"
                            >
                                <FaCamera />
                                <span>Add Photo</span>
                            </button>
                            <button
                                onClick={() => setShowVideoUpload(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm sm:text-base"
                            >
                                <FaVideo />
                                <span>Add Video</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <FaCamera className="text-2xl text-blue-600 mx-auto mb-2" />
                            <div className="text-xl font-bold text-gray-900">{stats.totalImages}</div>
                            <div className="text-sm text-gray-600">Photos</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <FaVideo className="text-2xl text-purple-600 mx-auto mb-2" />
                            <div className="text-xl font-bold text-gray-900">{stats.totalVideos}</div>
                            <div className="text-sm text-gray-600">Videos</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                            <FaHeart className="text-2xl text-red-600 mx-auto mb-2" />
                            <div className="text-xl font-bold text-gray-900">{stats.totalLikes}</div>
                            <div className="text-sm text-gray-600">Total Likes</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <FaEye className="text-2xl text-green-600 mx-auto mb-2" />
                            <div className="text-xl font-bold text-gray-900">{stats.totalViews}</div>
                            <div className="text-sm text-gray-600">Video Views</div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-xl p-1 shadow-lg">
                        <button
                            onClick={() => setActiveTab("photos")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                                activeTab === "photos"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-600 hover:text-blue-600"
                            }`}
                        >
                            <FaCamera />
                            <span>Photos ({stats.totalImages})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("videos")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                                activeTab === "videos"
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "text-gray-600 hover:text-purple-600"
                            }`}
                        >
                            <FaVideo />
                            <span>Videos ({stats.totalVideos})</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {activeTab === "photos" ? (
                            <div>
                                {images.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaCamera className="text-6xl text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">No photos yet</h3>
                                        <p className="text-gray-500 mb-6">Start sharing your travel memories!</p>
                                        <button
                                            onClick={() => setShowImageUpload(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                            <FaUpload />
                                            <span>Upload Your First Photo</span>
                                        </button>
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
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(image._id, "image");
                                                        }}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </div>
                                                
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{image.title}</h3>
                                                    
                                                    {image.location && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                                            <FaMapMarkerAlt className="text-xs" />
                                                            <span className="truncate">{image.location}</span>
                                                        </div>
                                                    )}

                                                    {image.description && (
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                            {image.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <FaHeart />
                                                            <span>{image.totalLikes || 0} likes</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <FaCalendar />
                                                            <span>{formatDate(image.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                {videos.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaVideo className="text-6xl text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">No videos yet</h3>
                                        <p className="text-gray-500 mb-6">Start sharing your travel experiences!</p>
                                        <button
                                            onClick={() => setShowVideoUpload(true)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                            <FaUpload />
                                            <span>Upload Your First Video</span>
                                        </button>
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
                                                onClick={() => setSelectedVideo(video)}
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
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(video._id, "video");
                                                        }}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                    {video.duration && (
                                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                                            {formatDuration(video.duration)}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{video.title}</h3>
                                                    
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

                                                    <div className="flex items-center justify-between text-sm text-gray-500">
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
                                                        <div className="flex items-center space-x-1">
                                                            <FaCalendar />
                                                            <span>{formatDate(video.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Modals */}
            <ImageUpload
                isOpen={showImageUpload}
                onClose={() => setShowImageUpload(false)}
                onUploadSuccess={fetchMyMedia}
            />

            <VideoUpload
                isOpen={showVideoUpload}
                onClose={() => setShowVideoUpload(false)}
                onUploadSuccess={fetchMyMedia}
            />

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
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

export default MyPhotos;