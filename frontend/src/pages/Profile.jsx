import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, reset } from "../features/auth/authSlice";

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

  // Load user info into form on component mount
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

  // Reset messages after success/error
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updatedData = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password) {
      updatedData.password = formData.password;
    }

    dispatch(updateProfile(updatedData));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

      {isError && <p className="text-red-500 mb-4 text-center">{message}</p>}
      {isSuccess && (
        <p className="text-green-500 mb-4 text-center">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
