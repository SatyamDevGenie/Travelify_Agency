import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
// 1. Import toast
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 2. Success Toast
    if (isSuccess && user) {
      // Assuming 'user' object has a 'name' property
      toast.success(`Welcome, ${user.name}! You are registered.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/");
    }

    // 3. Error Toast
    if (isError && message) {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]); // Added isError and message to dependencies

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !password) {
      toast.error("Please fill out all fields.", { theme: "colored" });
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
        {/* Removed redundant isError message rendering here since toast handles it */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg transition-colors ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;


