import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // menu icons

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 tracking-wide"
        >
          Travelify
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          </li>

          {/* If user is logged in */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpenUser(!openUser)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                <FaUserCircle size={22} />
                {user.name}
              </button>

              {/* Dropdown */}
              {openUser && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 border">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenUser(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </ul>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {openMenu && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-4 border-t">

          <Link
            to="/"
            className="block text-gray-700 text-lg hover:text-blue-600"
            onClick={() => setOpenMenu(false)}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="block text-gray-700 text-lg hover:text-blue-600"
            onClick={() => setOpenMenu(false)}
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="block text-gray-700 text-lg hover:text-blue-600"
                onClick={() => setOpenMenu(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-600 text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-blue-600 text-lg font-semibold"
              onClick={() => setOpenMenu(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;


