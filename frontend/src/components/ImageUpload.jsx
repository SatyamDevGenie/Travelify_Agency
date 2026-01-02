import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUpload, FaImage, FaTimes, FaTag, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const ImageUpload = ({ isOpen, onClose, onUploadSuccess }) => {
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
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast.error("File size must be less than 10MB");
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
            showToast.error("Please select an image to upload");
            return;
        }

        if (!formData.title.trim()) {
            showToast.error("Please enter a title for your image");
            return;
        }

        setUploading(true);

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const uploadFormData = new FormData();
            uploadFormData.append("image", selectedFile);
            uploadFormData.append("title", formData.title.trim());
            uploadFormData.append("description", formData.description.trim());
            uploadFormData.append("location", formData.location.trim());
            uploadFormData.append("tags", formData.tags.trim());

            const response = await axios.post("/api/images/upload", uploadFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                showToast.success("Image uploaded successfully! 🎉");
                
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
            const message = error.response?.data?.message || "Error uploading image";
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
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUpload className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Share Your Travel Photo</h2>
                                <p className="text-sm text-gray-500">Upload and share your amazing travel memories</p>
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
                                Upload Image *
                            </label>
                            
                            {!previewUrl ? (
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                        dragActive 
                                            ? "border-blue-500 bg-blue-50" 
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Drop your image here, or click to browse
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Supports: JPEG, PNG, GIF, WebP (Max 10MB)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                        id="file-input"
                                    />
                                    <label
                                        htmlFor="file-input"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-block"
                                    >
                                        Choose File
                                    </label>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                        {selectedFile?.name}
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
                                placeholder="Give your photo a catchy title..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                placeholder="Tell us about this photo, your experience, or the story behind it..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
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
                                placeholder="Where was this photo taken?"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Separate tags with commas to help others discover your photo
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={uploading || !selectedFile || !formData.title.trim()}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaUpload />
                                        <span>Share Photo</span>
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

export default ImageUpload;