import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUpload, FaVideo, FaTimes, FaTag, FaMapMarkerAlt, FaPlay } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const VideoUpload = ({ isOpen, onClose, onUploadSuccess }) => {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        tags: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
        if (!allowedTypes.includes(file.type)) {
            showToast.error("Please select a valid video file (MP4, MOV, or AVI)");
            return;
        }

        // Validate file size (100MB)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast.error("File size must be less than 100MB");
            return;
        }

        setSelectedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            showToast.error("Please select a video to upload");
            return;
        }

        if (!formData.title.trim()) {
            showToast.error("Please enter a title for your video");
            return;
        }

        setUploading(true);

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const uploadFormData = new FormData();
            uploadFormData.append("video", selectedFile);
            uploadFormData.append("title", formData.title.trim());
            uploadFormData.append("description", formData.description.trim());
            uploadFormData.append("location", formData.location.trim());
            uploadFormData.append("tags", formData.tags.trim());

            const response = await axios.post("/api/videos/upload", uploadFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                showToast.success("Video uploaded successfully! 🎉");
                
                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    location: "",
                    tags: ""
                });
                setSelectedFile(null);
                setPreviewUrl(null);
                
                // Call success callback
                if (onUploadSuccess) {
                    onUploadSuccess(response.data.data);
                }
                
                // Close modal
                onClose();
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error uploading video";
            showToast.error(message);
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaVideo className="text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Share Your Travel Video</h2>
                                <p className="text-sm text-gray-500">Upload and share your amazing travel experiences</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* File Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Video *
                            </label>
                            
                            {!previewUrl ? (
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                        dragActive 
                                            ? "border-purple-500 bg-purple-50" 
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <FaVideo className="text-4xl text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Drop your video here, or click to browse
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Supports: MP4, MOV, AVI (Max 100MB)
                                    </p>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                        id="video-input"
                                    />
                                    <label
                                        htmlFor="video-input"
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-block"
                                    >
                                        Choose Video
                                    </label>
                                </div>
                            ) : (
                                <div className="relative">
                                    <video
                                        src={previewUrl}
                                        className="w-full h-64 object-cover rounded-xl"
                                        controls
                                        preload="metadata"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                        {selectedFile?.name} ({formatFileSize(selectedFile?.size)})
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Give your video a catchy title..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Tell us about this video, your experience, or the story behind it..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 resize-none"
                                maxLength={500}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {formData.description.length}/500 characters
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaMapMarkerAlt className="inline mr-1" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Where was this video taken?"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                maxLength={100}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaTag className="inline mr-1" />
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="beach, sunset, mountains, adventure (separate with commas)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Separate tags with commas to help others discover your video
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={uploading || !selectedFile || !formData.title.trim()}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaUpload />
                                        <span>Share Video</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VideoUpload;