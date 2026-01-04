import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "../utils/toast";

const PhotoWishlistButton = ({ imageId, className = "", size = "md" }) => {
    const { user } = useSelector((state) => state.auth);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get user token helper
    const getUserToken = () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        return userData?.token;
    };

    // Check wishlist status when component mounts
    useEffect(() => {
        if (user && imageId) {
            checkWishlistStatus();
        }
    }, [user, imageId]);

    const checkWishlistStatus = async () => {
        try {
            const token = getUserToken();
            const response = await axios.get(`/api/photo-wishlist/check/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsInWishlist(response.data.data.isInWishlist);
        } catch (error) {
            console.error("Error checking photo wishlist status:", error);
        }
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast.error("Please login to save photos");
            return;
        }

        setLoading(true);

        try {
            const token = getUserToken();
            
            if (isInWishlist) {
                await axios.delete(`/api/photo-wishlist/${imageId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsInWishlist(false);
                showToast.success("Photo removed from saved");
            } else {
                await axios.post(`/api/photo-wishlist/${imageId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsInWishlist(true);
                showToast.success("Photo saved! ❤️");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Size configurations
    const sizeConfig = {
        sm: {
            button: "p-2",
            icon: "text-sm"
        },
        md: {
            button: "p-3",
            icon: "text-base"
        },
        lg: {
            button: "p-4",
            icon: "text-lg"
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            disabled={loading}
            className={`
                ${config.button} 
                ${className}
                ${isInWishlist 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                }
                rounded-full transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                backdrop-blur-sm shadow-lg hover:shadow-xl
            `}
            title={isInWishlist ? "Remove from saved photos" : "Save photo"}
        >
            {loading ? (
                <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 ${config.icon === 'text-sm' ? 'w-4 h-4' : config.icon === 'text-base' ? 'w-5 h-5' : 'w-6 h-6'}`}></div>
            ) : (
                <motion.div
                    animate={{ 
                        scale: isInWishlist ? [1, 1.2, 1] : 1,
                        rotate: isInWishlist ? [0, -10, 10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {isInWishlist ? (
                        <FaHeart className={`${config.icon} text-white`} />
                    ) : (
                        <FaRegHeart className={config.icon} />
                    )}
                </motion.div>
            )}
        </motion.button>
    );
};

export default PhotoWishlistButton;