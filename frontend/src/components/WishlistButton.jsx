import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../features/wishlist/wishlistSlice";
import { showToast } from "../utils/toast";

const WishlistButton = ({ tourId, className = "", size = "md", showText = false }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { wishlistStatus, loading } = useSelector((state) => state.wishlist);
    
    const isInWishlist = wishlistStatus[tourId] || false;
    const isLoading = loading;

    // Check wishlist status when component mounts
    useEffect(() => {
        if (user && tourId && wishlistStatus[tourId] === undefined) {
            dispatch(checkWishlistStatus(tourId));
        }
    }, [dispatch, user, tourId, wishlistStatus]);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast.error("Please login to add tours to wishlist");
            return;
        }

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(tourId)).unwrap();
                showToast.success("Removed from wishlist");
            } else {
                await dispatch(addToWishlist(tourId)).unwrap();
                showToast.success("Added to wishlist ❤️");
            }
        } catch (error) {
            showToast.error(error || "Something went wrong");
        }
    };

    // Size configurations
    const sizeConfig = {
        sm: {
            button: "p-2",
            icon: "text-sm",
            text: "text-xs"
        },
        md: {
            button: "p-3",
            icon: "text-base",
            text: "text-sm"
        },
        lg: {
            button: "p-4",
            icon: "text-lg",
            text: "text-base"
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={`
                ${config.button} 
                ${className}
                ${isInWishlist 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
                border rounded-full transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center space-x-2 font-medium
                ${showText ? 'px-4' : ''}
            `}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            {isLoading ? (
                <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 ${config.icon === 'text-sm' ? 'w-4 h-4' : config.icon === 'text-base' ? 'w-5 h-5' : 'w-6 h-6'}`}></div>
            ) : (
                <>
                    <motion.div
                        animate={{ 
                            scale: isInWishlist ? [1, 1.2, 1] : 1,
                            rotate: isInWishlist ? [0, -10, 10, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {isInWishlist ? (
                            <FaHeart className={`${config.icon} text-red-500`} />
                        ) : (
                            <FaRegHeart className={config.icon} />
                        )}
                    </motion.div>
                    {showText && (
                        <span className={config.text}>
                            {isInWishlist ? "Saved" : "Save"}
                        </span>
                    )}
                </>
            )}
        </motion.button>
    );
};

export default WishlistButton;