import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ 
    rating, 
    totalReviews = 0, 
    size = "text-sm", 
    showCount = true, 
    className = "" 
}) => {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FaStar key={i} className={`${size} text-yellow-400`} />
            );
        }

        // Half star
        if (hasHalfStar) {
            stars.push(
                <FaStarHalfAlt key="half" className={`${size} text-yellow-400`} />
            );
        }

        // Empty stars
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <FaRegStar key={`empty-${i}`} className={`${size} text-gray-300`} />
            );
        }

        return stars;
    };

    if (rating === 0 && totalReviews === 0) {
        return (
            <div className={`flex items-center space-x-1 ${className}`}>
                {[...Array(5)].map((_, i) => (
                    <FaRegStar key={i} className={`${size} text-gray-300`} />
                ))}
                {showCount && (
                    <span className="text-gray-500 text-xs ml-1">No reviews</span>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            <div className="flex items-center">
                {renderStars()}
            </div>
            {showCount && (
                <span className="text-gray-600 text-xs ml-1">
                    {rating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
            )}
        </div>
    );
};

export default StarRating;