import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTourById, updateTour } from "../features/tour/tourSlice";
import { useParams, useNavigate } from "react-router-dom";
// Import toast
import { toast } from "react-toastify";


// Reusable components (Left unchanged)
const LabelWithIcon = ({ label, icon }) => (
  <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center space-x-2">
    <span className="text-2xl">{icon}</span>
    <span>{label}</span>
  </label>
);

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

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <LabelWithIcon label={label} icon="📂" />
    <select
      value={value}
      onChange={onChange}
      className="w-full p-4 border rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 text-lg"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const EditTour = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleTour, singleLoading, singleError, loading } = useSelector(
    (state) => state.tours
  );
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [availableSlots, setAvailableSlots] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState(null);

  const categories = ["Domestic", "International"];
  const domesticPlaces = ["Goa", "Manali", "Kerala", "Mumbai", "Jammu & Kashmir", "Rajasthan", "Kolkata"];
  const internationalPlaces = ["Thailand", "Singapore", "Dubai", "Bali", "London"];
  const subcategoriesOptions =
    category === "Domestic"
      ? domesticPlaces
      : category === "International"
        ? internationalPlaces
        : [];

  // Fetch tour details
  useEffect(() => {
    dispatch(fetchTourById(id));
  }, [dispatch, id]);

  // Populate form with existing tour data
  useEffect(() => {
    if (singleTour) {
      setTitle(singleTour.title || "");
      setDescription(singleTour.description || "");
      setLocation(singleTour.location || "");
      setPrice(singleTour.price || "");
      setAvailableSlots(singleTour.availableSlots || "");
      setCategory(singleTour.category || "");
      setSubcategory(singleTour.subcategory || "");
    }
  }, [singleTour]);

  // Redirect non-admin users
  useEffect(() => {
    if (!user?.isAdmin) navigate("/");
  }, [user, navigate]);

  // ✅ Handle Update Tour
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !location || !price || !availableSlots || !category || !subcategory) {
      // Toast for missing fields
      toast.error("Please fill in all required fields before updating the tour.", { theme: "colored" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("subcategory", subcategory);

    // Convert strings to numbers
    formData.append("price", Number(price));
    formData.append("availableSlots", Number(availableSlots));

    if (image) formData.append("image", image);

    try {
      await dispatch(updateTour({ id, updatedData: formData })).unwrap();

      // Success Toast
      toast.success("Tour updated successfully ✅", { theme: "colored" });
      navigate(`/tour/${id}`);

    } catch (err) {
      // Error Toast
      const errorMessage = err?.message || "Failed to update tour. Please try again.";
      toast.error(errorMessage, { theme: "colored" });
    }
  };

  if (singleLoading)
    return <p className="text-center mt-10 text-xl sm:text-2xl font-semibold text-indigo-600">Loading Tour Data...</p>;

  if (singleError)
    return <p className="text-center mt-10 text-xl sm:text-2xl font-semibold text-red-500">Error: {singleError}</p>;

  if (!singleTour) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block text-xs sm:text-sm font-semibold text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full ring-2 ring-yellow-200">
            EDIT MODE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 leading-tight">
            Update Tour: {singleTour.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 mt-2">
            Modify the details and image of this tour.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 border border-gray-100 transition hover:shadow-2xl">
          {/* Title & Location */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
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

          {/* Category & Subcategory */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <SelectField
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory("");
              }}
              options={categories}
            />
            <SelectField
              label="Subcategory / Place"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              options={subcategoriesOptions}
            />
          </div>

          {/* Description */}
          <div>
            <LabelWithIcon label="Tour Description" icon="📝" />
            <textarea
              className="w-full p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-300 text-lg resize-y min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the tour."
              required
            />
          </div>

          {/* Price & Slots */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-gray-100">
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

          {/* Image */}
          <div className="pt-4 border-t border-gray-100">
            <LabelWithIcon label="Tour Hero Image" icon="🖼️" />
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-medium text-gray-500 mb-2">Current Image:</h3>
              <img
                src={singleTour.image}
                alt={singleTour.title}
                className="w-36 sm:w-40 h-36 sm:h-40 object-cover rounded-xl shadow-lg border-4 border-gray-100"
              />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-gray-500 mb-2 mt-4">Upload New Image (Optional):</h3>
            <div className="flex items-center space-x-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-yellow-400 transition duration-300 cursor-pointer bg-yellow-50/50">
              <input
                type="file"
                accept="image/*"
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 file:transition cursor-pointer"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            {image && <p className="text-sm text-green-600 mt-2">✅ New file selected: {image.name}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-extrabold text-xl py-4 rounded-xl shadow-lg hover:shadow-orange-400/50 transition transform hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || singleLoading}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Saving Changes...
              </span>
            ) : (
              <span>💾 Save Updated Tour</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTour;


