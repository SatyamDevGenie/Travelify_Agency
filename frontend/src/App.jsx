import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastContainerConfig, showToast } from "./utils/toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Tours from "./components/Tours";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TourDetail from "./pages/TourDetail";
import CreateTour from "./pages/CreateTour";
import EditTour from "./pages/EditTour";
import MyBookings from "./pages/MyBookings";
import MyReviews from "./pages/MyReviews";
import MyMedia from "./pages/MyMedia";
import MyPhotos from "./pages/MyPhotos";
import AdminBookings from "./pages/AdminBookings";
import AdminGPSUpdate from "./pages/AdminGPSUpdate";
import Wishlist from "./pages/Wishlist";
import SavedPhotos from "./pages/SavedPhotos";

function App() {
  // Professional welcome toast
  useEffect(() => {
    showToast.success("Welcome to Travelify! ✈️", {
      autoClose: 3000,
    });
  }, []);

  return (
    <Router>
      {/* Professional Toast Container */}
      <ToastContainer {...toastContainerConfig} />

      <Navbar />

      {/* Add padding for fixed navbar */}
      <div className="pt-18">
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Tours pages */}
          <Route path="/tours" element={<Tours />} />
          <Route path="/tour/:id" element={<TourDetail />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Create Tour */}
          <Route path="/create-tour" element={<CreateTour />} />

          {/* Update Tour */}
          <Route path="/edit-tour/:id" element={<EditTour />} />

          {/* Bookings */}
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/my-photos" element={<MyPhotos />} />
          <Route path="/my-media" element={<MyMedia />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/saved-photos" element={<SavedPhotos />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/gps-update" element={<AdminGPSUpdate />} />

        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;


