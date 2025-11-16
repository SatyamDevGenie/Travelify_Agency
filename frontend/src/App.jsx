import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Tours from "./components/Tours";


// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TourDetail from "./pages/TourDetail";
import CreateTour from "./pages/CreateTour";
import EditTour from "./pages/EditTour";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Add padding for fixed navbar */}
      <div className="pt-18">
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

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


        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;


