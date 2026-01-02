import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCamera, FaUpload, FaHeart, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import ImageUpload from "./ImageUpload";
import ImageGallery from "./ImageGallery";

const ImageUploadSection = () => {
    const { user } = useSelector((state) => state.auth);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
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
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Memories
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                            Upload and share your amazing travel photos with the Travelify community. 
                            Inspire others with your adventures and discover incredible destinations through fellow travelers' eyes.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-lg"
                        >
                            <FaCamera className="text-3xl text-blue-600 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
                            <p className="text-gray-600">Photos Shared</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-6 shadow-lg"
                        >
                            <FaUsers className="text-3xl text-green-600 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                            <p className="text-gray-600">Contributors</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl p-6 shadow-lg"
                        >
                            <FaHeart className="text-3xl text-red-600 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-gray-900">5000+</h3>
                            <p className="text-gray-600">Likes Given</p>
                        </motion.div>
                    </div>

                    {/* Upload Button */}
                    {user ? (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => setShowUploadModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
                        >
                            <FaUpload className="text-xl" />
                            <span>Share Your Photo</span>
                        </motion.button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto"
                        >
                            <FaCamera className="text-4xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Share?</h3>
                            <p className="text-gray-600 mb-4">
                                Login to upload and share your travel photos with the community
                            </p>
                            <a
                                href="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                            >
                                Login to Upload
                            </a>
                        </motion.div>
                    )}
                </div>

                {/* Image Gallery */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Latest Travel Photos
                    </h3>
                    <ImageGallery refreshTrigger={refreshTrigger} />
                </div>
            </div>

            {/* Upload Modal */}
            <ImageUpload
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </section>
    );
};

export default ImageUploadSection;