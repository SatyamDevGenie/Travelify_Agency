import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
// 1. Import toast
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 2. Check for success *before* navigating
    if (isSuccess && user) {
      // Assuming 'user' object has a 'name' property
      toast.success(`Welcome back, ${user.name}`, {
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

    // 3. Display error toast if login failed
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
    // Added 'message' and 'isError' to dependencies for error handling
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side validation check
    if (!email || !password) {
      toast.error("Please enter both email and password.", { theme: "colored" });
      return;
    }
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {/* Removed redundant isError message rendering here since toast will handle it */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-700">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;




