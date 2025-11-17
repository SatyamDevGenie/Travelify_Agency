import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTours } from "../features/tour/tourSlice";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Tours = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tours, loading, error } = useSelector((state) => state.tours);
  const { user } = useSelector((state) => state.auth);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");

  // Categories & Subcategories
  const categories = ["Domestic", "International"];
  const subcategoriesData = {
    Domestic: ["Goa", "Manali", "Kerala", "Mumbai", "Jammu & Kashmir", "Rajasthan", "Kolkata"],
    International: ["Thailand", "Singapore", "Dubai", "Bali", "London"]
  };

  // Get current subcategories based on selected category
  const subcategories = categoryFilter ? subcategoriesData[categoryFilter] : [];

  useEffect(() => {
    dispatch(fetchTours());
  }, [dispatch]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryFilter("");
  }, [categoryFilter]);

  // Filter tours dynamically
  const filteredTours = tours.filter((tour) => {
    const categoryMatch = categoryFilter ? tour.category === categoryFilter : true;
    const subcategoryMatch = subcategoryFilter ? tour.subcategory === subcategoryFilter : true;
    return categoryMatch && subcategoryMatch;
  });

  if (loading)
    return <p className="text-center mt-10 text-lg sm:text-xl">Loading tours...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-lg sm:text-xl text-red-500">
        Error: {error}
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      {/* Header + Create Tour Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Explore Our Adventures
        </h2>

        {user?.isAdmin && (
          <button
            onClick={() => navigate("/create-tour")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base md:text-lg"
          >
            + Create Tour
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={subcategoryFilter}
          onChange={(e) => setSubcategoryFilter(e.target.value)}
          className="p-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-indigo-300"
          disabled={!categoryFilter}
        >
          <option value="">All Places</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <p className="text-center text-gray-500 text-lg sm:text-xl mt-12">
          No tours found for selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => (
            <motion.div
              key={tour._id}
              whileHover={{ scale: 1.04 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Tour Image */}
              <Link
                to={`/tour/${tour._id}`}
                className="w-full h-56 sm:h-64 md:h-52 lg:h-60 block"
              >
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </Link>

              {/* Tour Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl md:text-lg font-semibold text-gray-900">
                  {tour.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Location: {tour.location}
                </p>
                <p className="mt-2 text-gray-700 text-sm sm:text-base line-clamp-3 flex-1">
                  {tour.description}
                </p>

                <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
                  <p className="font-bold text-blue-600 text-base sm:text-lg">
                    ₹{tour.price}
                  </p>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base shadow-md transition-all duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tours;

