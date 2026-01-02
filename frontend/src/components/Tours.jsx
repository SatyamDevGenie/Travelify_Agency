import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTours } from "../features/tour/tourSlice";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../utils/toast";
import StarRating from "./StarRating";

const Tours = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Refetch tours when navigating to this route (handles coming back from create tour)
  useEffect(() => {
    if (location.pathname === '/tours' || location.pathname === '/') {
      dispatch(fetchTours());
    }
  }, [location.pathname, dispatch]);

  // Refetch tours when the page becomes visible (handles navigation back from create tour)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchTours());
      }
    };

    const handleFocus = () => {
      dispatch(fetchTours());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
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

  // Handle Book Now button click
  const handleBookNow = (tour) => {
    if (!user) {
      showToast.auth.loginRequired({
        autoClose: 3000,
      });
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }
    
    // If user is logged in, navigate to tour detail page
    navigate(`/tour/${tour._id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-responsive">
        <div className="flex items-center space-x-3">
          <div className="loading-spinner"></div>
          <p className="text-heading text-slate-600">Loading tours...</p>
        </div>
      </div>
    );
    
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-responsive">
        <div className="text-center">
          <p className="text-heading text-red-600 mb-2">Error Loading Tours</p>
          <p className="text-body text-slate-500">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-responsive">
      <div className="container-fluid">
        {/* Header + Create Tour Button */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="page-title">
                Explore Our Adventures
              </h1>
              <p className="page-subtitle">
                Discover amazing destinations and book your next journey
              </p>
            </div>

            {user?.isAdmin && (
              <button
                onClick={() => navigate("/create-tour")}
                className="btn-success"
              >
                + Create Tour
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field w-auto min-w-[200px]"
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
            className="input-field w-auto min-w-[200px]"
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
          <div className="card text-center p-responsive">
            <div className="text-6xl mb-4">🏝️</div>
            <h2 className="text-heading mb-3">
              No Tours Found
            </h2>
            <p className="text-body text-slate-600">
              No tours found for selected filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid-responsive">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour._id}
                whileHover={{ scale: 1.02 }}
                className="card hover-lift animate-fade-in flex flex-col"
              >
                {/* Tour Image */}
                <Link
                  to={`/tour/${tour._id}`}
                  className="block"
                >
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-48 sm:h-56 lg:h-48 xl:h-56 object-cover rounded-t-lg hover-scale"
                  />
                </Link>

                {/* Tour Content */}
                <div className="card-body flex flex-col flex-1">
                  <h3 className="text-heading mb-2">
                    {tour.title}
                  </h3>
                  <p className="text-muted mb-2">
                    📍 {tour.location}
                  </p>
                  
                  {/* Rating Display */}
                  <div className="mb-3">
                    <StarRating 
                      rating={tour.averageRating || 0} 
                      totalReviews={tour.totalReviews || 0}
                      size="text-sm"
                    />
                  </div>
                  
                  <p className="text-body line-clamp-3 flex-1 mb-4">
                    {tour.description}
                  </p>

                  <div className="flex justify-between items-center flex-wrap gap-2 mt-auto">
                    <p className="text-heading text-blue-600">
                      ₹{tour.price.toLocaleString("en-IN")}
                    </p>

                    <button 
                      onClick={() => handleBookNow(tour)}
                      className="btn-primary flex items-center space-x-1"
                    >
                      {!user ? (
                        <>
                          <span>🔐</span>
                          <span>Login to Book</span>
                        </>
                      ) : (
                        <>
                          <span>🎟️</span>
                          <span>Book Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;

