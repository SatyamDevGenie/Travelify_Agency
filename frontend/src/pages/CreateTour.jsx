import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTour } from "../features/tour/tourSlice";
import { useNavigate } from "react-router-dom";

const CreateTour = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.tours);
    const { user } = useSelector((state) => state.auth);

    // Redirect non-admin users
    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/");
        }
    }, [user, navigate]);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [availableSlots, setAvailableSlots] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation before dispatch
        if (!title || !description || !location || !price || !availableSlots || !image) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await dispatch(
                createTour({
                    title,
                    description,
                    location,
                    price,
                    availableSlots,
                    image, // File object
                })
            ).unwrap();

            alert("Tour Created Successfully! 🎉");
            navigate("/tours");
        } catch (err) {
            alert(err || "Failed to create tour. Please check your inputs.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="inline-block text-sm font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full ring-2 ring-indigo-200">
                        ADMIN PANEL
                    </span>
                    <h2 className="text-5xl font-semibold text-gray-900 mt-4 leading-tight">
                        Create a new tour
                    </h2>
                    <p className="text-xl text-gray-500 mt-2">
                        Fill in the details to list an exciting new tour package.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-4xl rounded-[2.5rem] p-10 space-y-8 border border-gray-100 transform transition duration-500 hover:shadow-5xl"
                >
                    {/* Title & Location (Two Columns) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <InputField
                            label="Tour Title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Mystic Himalayan Trek"
                            icon="🏔️"
                        />
                        <InputField
                            label="Location / Destination"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Manali, Himachal Pradesh"
                            icon="📍"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <LabelWithIcon label="Tour Description" icon="📝" />
                        <textarea
                            className="w-full p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-300 text-lg resize-y min-h-[150px]"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide a detailed, captivating description of the tour."
                            required
                        ></textarea>
                    </div>

                    {/* Price + Slots (Two Columns) */}
                    <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                        <InputField
                            label="Price (₹ per person)"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g., 15000"
                            icon="💰"
                            min="1"
                        />
                        <InputField
                            label="Available Slots"
                            type="number"
                            value={availableSlots}
                            onChange={(e) => setAvailableSlots(e.target.value)}
                            placeholder="e.g., 20"
                            icon="👥"
                            min="1"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="pt-4 border-t border-gray-100">
                        <LabelWithIcon label="Tour Hero Image" icon="🖼️" />
                        <div className="flex items-center space-x-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 transition duration-300 cursor-pointer bg-indigo-50/50">
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 file:transition cursor-pointer"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </div>
                        {image && (
                            <p className="text-sm text-green-600 mt-2">
                                ✅ File selected: **{image.name}**
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-extrabold text-xl py-4 rounded-xl shadow-2xl hover:shadow-indigo-400/50 transition duration-300 transform hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Publishing Tour...
                            </span>
                        ) : (
                            <span>🚀 Create & Publish Tour</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Helper component for standard text/number inputs
const InputField = ({ label, type, value, onChange, placeholder, icon, min }) => (
    <div>
        <LabelWithIcon label={label} icon={icon} />
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className="w-full p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-300 text-lg"
            required
        />
    </div>
);

// Helper component for styled labels
const LabelWithIcon = ({ label, icon }) => (
    <label className="block text-xl font-semibold text-gray-700 mb-2 flex items-center space-x-2">
        <span className="text-2xl">{icon}</span>
        <span>{label}</span>
    </label>
);

export default CreateTour;

