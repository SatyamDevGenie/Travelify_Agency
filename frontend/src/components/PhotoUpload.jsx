import { useState } from "react";
import { useSelector } from "react-redux";
import { FaCamera, FaUpload, FaTimes, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const PhotoUpload = ({ onPhotoUploaded = () => {} }) => {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        tags: ""
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast.error("Please select an image file");
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showToast.error("File size must be less than 10MB");
                return;
            }

            setSelectedFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            showToast.error("Please select a photo");
            return;
        }

        if (!formData.title.trim()) {
            showToast.error("Please enter a title");
            return;
        }

        setIsUploading(true);

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const uploadData = new FormData();
            uploadData.append('photo', selectedFile);
            uploadData.append('title', formData.title.trim());
            uploadData.append('description', formData.description.trim());
            uploadData.append('location', formData.location.trim());
            
            // Parse tags
            if (formData.tags.trim()) {
                const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                uploadData.append('tags', JSON.stringify(tags));
            }

            const response = await axios.post(
                'http://localhost:5000/api/photos/upload',
                uploadData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                showToast.success("Photo uploaded successfully!");
                
                // Reset form
                setSelectedFile(null);
                setPreview(null);
                setFormData({
                    title: "",
                    description: "",
                    location: "",
                    tags: ""
                });
                setIsOpen(false);
                
                // Notify parent component
                onPhotoUploaded(response.data.photo);
            }

        } catch (error) {
            console.error("Upload error:", error);
            showToast.error(
                error.response?.data?.message || "Error uploading photo"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreview(null);
        setFormData({
            title: "",
            description: "",
            location: "",
            tags: ""
        });
        setIsOpen(false);
    };

    if (!user) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <FaCamera className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Login to share your travel photos</p>
            </div>
        );
    }

    return (
        <>
            {/* Upload Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaCamera />
                <span>Share Photo</span>
            </motion.button>

            {/* Upload Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FaImage className="text-2xl" />
                                        <h2 className="text-xl font-bold">Share Your Travel Photo</h2>
                                    </div>
                                    <button
                                        onClick={resetForm}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Photo *
                                    </label>
                                    {!preview ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="photo-upload"
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="cursor-pointer flex flex-col items-center space-y-2"
                                            >
                                                <FaUpload className="text-3xl text-gray-400" />
                                                <span className="text-gray-600">Click to select photo</span>
                                                <span className="text-sm text-gray-400">Max 10MB</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreview(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <FaTimes />
                                            </button>
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
                                        placeholder="Give your photo a title..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        placeholder="Tell us about this photo..."
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        maxLength={500}
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Where was this taken?"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        maxLength={100}
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="beach, sunset, vacation (comma separated)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Separate tags with commas
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading || !selectedFile}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload />
                                                <span>Share Photo</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PhotoUpload;