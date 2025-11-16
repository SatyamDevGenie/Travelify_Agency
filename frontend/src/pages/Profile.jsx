import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, reset } from "../features/auth/authSlice";

// Responsive Input Component
const ProfileInputField = ({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    icon,
    required = false,
}) => (
    <div className="relative w-full">
        <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 flex items-center space-x-2">
            <span className="text-lg md:text-xl">{icon}</span>
            <span>{label}</span>
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 md:p-4 pl-12 rounded-xl border-2 border-gray-200 
                       focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 
                       shadow-inner transition duration-300 text-base md:text-lg"
            placeholder={placeholder}
            required={required}
        />

        <span className="absolute left-3 md:left-4 top-[46px] md:top-[52px] text-indigo-500 text-lg md:text-xl">
            {icon}
        </span>
    </div>
);

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [displayMessage, setDisplayMessage] = useState(null);
    const [isSuccessLocal, setIsSuccessLocal] = useState(false);

    // Load user info
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: "",
                confirmPassword: "",
            });
        }
    }, [user]);

    // Manage response messages
    useEffect(() => {
        if (isError && message) {
            setDisplayMessage(message);
            setIsSuccessLocal(false);
        } else if (isSuccess && message) {
            setDisplayMessage(message);
            setIsSuccessLocal(true);
        }

        if (isError || isSuccess) {
            const timer = setTimeout(() => {
                dispatch(reset());
                setDisplayMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, isError, isSuccess, message]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setDisplayMessage("Passwords do not match!");
            setIsSuccessLocal(false);
            return;
        }

        const updatedData = {
            name: formData.name,
            email: formData.email,
        };

        if (formData.password) updatedData.password = formData.password;

        dispatch(updateProfile(updatedData));

        setFormData((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
        }));
    };

    if (isLoading && !user)
        return (
            <p className="text-center mt-20 text-xl md:text-2xl font-semibold text-indigo-600">
                Loading profile data...
            </p>
        );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 sm:px-6 md:px-8">
            <div className="w-full max-w-lg sm:max-w-xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 
                            border-t-4 border-indigo-600 transition hover:shadow-2xl">

                {/* Top Section */}
                <div className="text-center mb-8 sm:mb-10">
                    <span className="inline-block text-4xl sm:text-5xl mb-2">👤</span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Your Account Settings
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg mt-2">
                        Update your personal information below.
                    </p>
                </div>

                {/* Alerts */}
                {displayMessage && (
                    <div
                        className={`p-3 sm:p-4 rounded-lg mb-6 shadow ${
                            isSuccessLocal
                                ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                                : "bg-red-100 text-red-700 border-l-4 border-red-500"
                        }`}
                    >
                        <p className="font-semibold text-center text-sm sm:text-base">
                            {isSuccessLocal ? "Success: " : "Error: "}
                            {displayMessage}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

                    <ProfileInputField
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        
                        required
                    />

                    <ProfileInputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      
                        required
                    />

                    {/* Password Section */}
                    <div className="pt-4 border-t border-dashed border-gray-300">
                        <h3 className="text-lg sm:text-xl font-bold text-indigo-600 mb-4">
                            Change Password (Optional)
                        </h3>

                        <ProfileInputField
                            label="New Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                          
                        />

                        <ProfileInputField
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat new password"
                          
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 
                                   text-white font-extrabold text-lg sm:text-xl py-3 sm:py-4 rounded-xl 
                                   shadow-lg transform hover:scale-[1.01] transition duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Updating...
                            </span>
                        ) : (
                            "✨ Save Changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;






