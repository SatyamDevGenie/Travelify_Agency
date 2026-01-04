import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCamera, FaVideo, FaUpload, FaHeart, FaUsers, FaEye, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import ImageUpload from "./ImageUpload";
import VideoUpload from "./VideoUpload";
import ImageGallery from "./ImageGallery";
import VideoGallery from "./VideoGallery";

const MediaUploadSection = () => {
    const { user } = useSelector((state) => state.auth);
    const [showImageUploadModal, setShowImageUploadModal] = useState(false);
    const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
    const [activeTab, setActiveTab] = useState("photos"); // "photos" or "videos"
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
            <div className="container-fluid">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Share Your Travel{" "}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Stories
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                            Upload and share your amazing travel photos and videos with the Travelify community. 
                            Inspire others with your adventures and discover incredible destinations through fellow travelers' experiences.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
                        >
                            <FaCamera className="text-2xl sm:text-3xl text-blue-600 mx-auto mb-2 sm:mb-3" />
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">1000+</h3>
                            <p className="text-sm sm:text-base text-gray-600">Photos</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
                        >
                            <FaVideo className="text-2xl sm:text-3xl text-purple-600 mx-auto mb-2 sm:mb-3" />
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">500+</h3>
                            <p className="text-sm sm:text-base text-gray-600">Videos</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
                        >
                            <FaUsers className="text-2xl sm:text-3xl text-green-600 mx-auto mb-2 sm:mb-3" />
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">800+</h3>
                            <p className="text-sm sm:text-base text-gray-600">Contributors</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
                        >
                            <FaHeart className="text-2xl sm:text-3xl text-red-600 mx-auto mb-2 sm:mb-3" />
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">10K+</h3>
                            <p className="text-sm sm:text-base text-gray-600">Likes</p>
                        </motion.div>
                    </div>

                    {/* Upload Buttons */}
                    {user ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={() => setShowImageUploadModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 w-full sm:w-auto"
                            >
                                <FaCamera className="text-lg sm:text-xl" />
                                <span className="sm:inline">Share Photo</span>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                                onClick={() => setShowVideoUploadModal(true)}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 w-full sm:w-auto"
                            >
                                <FaVideo className="text-lg sm:text-xl" />
                                <span className="sm:inline">Share Video</span>
                            </motion.button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto"
                        >
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <FaCamera className="text-3xl text-blue-500" />
                                <FaVideo className="text-3xl text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Share?</h3>
                            <p className="text-gray-600 mb-4">
                                Login to upload and share your travel photos and videos with the community
                            </p>
                            <a
                                href="/login"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                            >
                                Login to Upload
                            </a>
                        </motion.div>
                    )}
                </div>

                {/* Media Gallery */}
                <div className="mt-16">
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
                                <span>Photos</span>
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
                                <span>Videos</span>
                            </button>
                        </div>
                    </div>

                    {/* Gallery Content */}
                    <div className="min-h-[400px]">
                        {activeTab === "photos" ? (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2">
                                    <FaCamera className="text-blue-600" />
                                    <span>Latest Travel Photos</span>
                                </h3>
                                <ImageGallery refreshTrigger={refreshTrigger} />
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2">
                                    <FaPlay className="text-purple-600" />
                                    <span>Latest Travel Videos</span>
                                </h3>
                                <VideoGallery refreshTrigger={refreshTrigger} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modals */}
            <ImageUpload
                isOpen={showImageUploadModal}
                onClose={() => setShowImageUploadModal(false)}
                onUploadSuccess={handleUploadSuccess}
            />

            <VideoUpload
                isOpen={showVideoUploadModal}
                onClose={() => setShowVideoUploadModal(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </section>
    );
};

export default MediaUploadSection;