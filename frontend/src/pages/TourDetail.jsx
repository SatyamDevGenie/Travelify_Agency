import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTourById, deleteTour } from "../features/tour/tourSlice";
import { useParams, useNavigate } from "react-router-dom";

const TourDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleTour, singleLoading, singleError } = useSelector(
    (state) => state.tours
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTourById(id));
  }, [dispatch, id]);

  if (singleLoading)
    return (
      <p className="text-center mt-10 text-xl sm:text-2xl font-semibold text-indigo-600">
        Loading Tour...
      </p>
    );
  if (singleError)
    return (
      <p className="text-center text-red-500 mt-10 text-xl sm:text-2xl font-semibold">
        {singleError}
      </p>
    );
  if (!singleTour) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      dispatch(deleteTour(singleTour._id))
        .unwrap()
        .then(() => {
          alert("Tour deleted successfully!");
          navigate("/tours");
        })
        .catch((err) => alert(err || "Failed to delete tour"));
    }
  };

  const handleEdit = () => {
    navigate(`/edit-tour/${singleTour._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden transform transition duration-500 hover:scale-[1.01] border border-gray-100">

        {/* Image + Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Tour Image */}
          <div className="relative w-full h-80 sm:h-[400px] md:h-[500px] lg:h-[700px]">
            <img
              src={singleTour.image}
              alt={singleTour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Tour Content */}
          <div className="p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8">
            {/* Title & Category */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs sm:text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 uppercase tracking-wider">
                  🌟 {singleTour.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs sm:text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200 uppercase tracking-wider">
                  📌 {singleTour.subcategory}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {singleTour.title}
              </h1>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3 border-b pb-1 sm:pb-2">
                Overview
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                {singleTour.description}
              </p>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-gray-100">
              <InfoCard icon="📍" label="Location" value={singleTour.location} />
              <InfoCard icon="✅" label="Available Slots" value={singleTour.availableSlots} />
            </div>

            {/* Price & Booking */}
            <div className="pt-6 sm:pt-8 space-y-4 sm:space-y-6">
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700">
                Price:{" "}
                <span className="ml-1 sm:ml-2">
                  ₹{singleTour.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500">
                  {" "}
                  / per person
                </span>
              </p>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2">
                <span>🎟️</span>
                <span>Book Your Adventure Now</span>
              </button>

              {/* Admin Controls */}
              {user?.isAdmin && (
                <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-6 space-y-3 sm:space-y-0">
                  <button
                    onClick={handleEdit}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 sm:py-4 rounded-xl shadow-md transition"
                  >
                    Edit Tour
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 rounded-xl shadow-md transition"
                  >
                    Delete Tour
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Card
const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-inner">
    <span className="text-2xl sm:text-3xl text-indigo-500">{icon}</span>
    <div>
      <p className="text-sm sm:text-base font-medium text-gray-500">{label}</p>
      <p className="text-lg sm:text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default TourDetail;


