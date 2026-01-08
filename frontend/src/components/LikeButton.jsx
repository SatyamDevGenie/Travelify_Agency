import { useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { showToast } from "../utils/toast";

const LikeButton = ({ 
    type, // 'tour', 'video', 'photo'
    itemId, 
    initialLiked = false, 
    initialCount = 0,
    onLikeChange = () => {} 
}) => {
    const { user } = useSelector((state) => state.auth);
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast.error("Please login to like items");
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const response = await axios.post(
                `http://localhost:5000/api/likes/${type}/${itemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const newIsLiked = response.data.isLiked;
                const newCount = response.data.totalLikes;
                
                setIsLiked(newIsLiked);
                setLikeCount(newCount);
                
                // Call parent callback
                onLikeChange(newIsLiked, newCount);
                
                showToast.success(
                    newIsLiked ? 
                    `${type.charAt(0).toUpperCase() + type.slice(1)} liked!` : 
                    `${type.charAt(0).toUpperCase() + type.slice(1)} unliked!`
                );
            }
        } catch (error) {
            console.error("Like error:", error);
            showToast.error("Error updating like status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading || !user}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200 ${
                isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } ${!user ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} ${
                isLoading ? "opacity-50 cursor-wait" : ""
            }`}
            title={!user ? "Login to like" : isLiked ? "Unlike" : "Like"}
        >
            {isLiked ? (
                <FaHeart className="text-red-500" />
            ) : (
                <FaRegHeart />
            )}
            <span className="text-sm font-medium">{likeCount}</span>
        </button>
    );
};

export default LikeButton;