import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaUserCircle, FaBell, FaSearch } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60 fixed w-full top-0 left-0 z-50">
      <div className="container-fluid">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              Travelify
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <FaBell size={18} />
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenUser(!openUser)}
                    className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-white" size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.isAdmin ? 'Admin' : 'User'}</p>
                    </div>
                  </button>

                  {openUser && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <FaUserCircle className="mr-3 text-slate-400" size={16} />
                        Profile
                      </Link>
                      
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <span className="mr-3 text-slate-400">📋</span>
                        My Bookings
                      </Link>
                      
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <span className="mr-3 text-slate-400">❤️</span>
                        My Wishlist
                      </Link>
                      
                      <Link
                        to="/saved-photos"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <span className="mr-3 text-slate-400">📸</span>
                        Saved Photos
                      </Link>
                      
                      <Link
                        to="/my-reviews"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <span className="mr-3 text-slate-400">⭐</span>
                        My Reviews
                      </Link>
                      
                      <Link
                        to="/my-photos"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <span className="mr-3 text-slate-400">📷</span>
                        My Photos
                      </Link>
                      
                      <Link
                        to="/my-media"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenUser(false)}
                      >
                        <span className="mr-3 text-slate-400">🎬</span>
                        My Media
                      </Link>
                      
                      {user.isAdmin && (
                        <>
                          <div className="divider my-2"></div>
                          <Link
                            to="/create-tour"
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setOpenUser(false)}
                          >
                            <span className="mr-3 text-slate-400">➕</span>
                            Create Tour
                          </Link>
                          <Link
                            to="/admin/bookings"
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setOpenUser(false)}
                          >
                            <span className="mr-3 text-slate-400">⚙️</span>
                            Manage Bookings
                          </Link>
                          <Link
                            to="/admin/gps-update"
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => setOpenUser(false)}
                          >
                            <span className="mr-3 text-slate-400">🗺️</span>
                            Update GPS
                          </Link>
                        </>
                      )}
                      
                      <div className="divider my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="mr-3">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {openMenu && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in">
          <div className="container-fluid py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setOpenMenu(false)}
              className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={() => setOpenMenu(false)}
              className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setOpenMenu(false)}
              className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
            >
              Contact
            </Link>

            {user ? (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 pb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                    <FaUserCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  Profile
                </Link>
                
                <Link
                  to="/my-bookings"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  My Bookings
                </Link>
                
                <Link
                  to="/wishlist"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  My Wishlist
                </Link>
                
                <Link
                  to="/saved-photos"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  Saved Photos
                </Link>
                
                <Link
                  to="/my-reviews"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  My Reviews
                </Link>
                
                <Link
                  to="/my-photos"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  My Photos
                </Link>
                
                <Link
                  to="/my-media"
                  onClick={() => setOpenMenu(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                >
                  My Media
                </Link>
                
                {user.isAdmin && (
                  <>
                    <Link
                      to="/create-tour"
                      onClick={() => setOpenMenu(false)}
                      className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                    >
                      Create Tour
                    </Link>
                    <Link
                      to="/admin/bookings"
                      onClick={() => setOpenMenu(false)}
                      className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                    >
                      Manage Bookings
                    </Link>
                    <Link
                      to="/admin/gps-update"
                      onClick={() => setOpenMenu(false)}
                      className="block text-slate-700 hover:text-slate-900 py-2 transition-colors"
                    >
                      Update GPS
                    </Link>
                  </>
                )}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-700 py-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                <Link
                  to="/login"
                  onClick={() => setOpenMenu(false)}
                  className="btn-secondary w-full text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpenMenu(false)}
                  className="btn-primary w-full text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout, reset } from "../features/auth/authSlice";
// import { FaUserCircle } from "react-icons/fa";
// import { HiMenu, HiX } from "react-icons/hi";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const [openMenu, setOpenMenu] = useState(false);
//   const [openUser, setOpenUser] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(reset());
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm bg-opacity-90">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-3xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 tracking-wide"
//         >
//           Travelify
//         </Link>

//         {/* Desktop Links */}
//         <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
//           <li>
//             <Link className="hover:text-indigo-600 transition duration-300 font-semibold" to="/">Home</Link>
//           </li>
//           <li>
//             <Link className="hover:text-indigo-600 transition duration-300 font-semibold" to="/about">About</Link>
//           </li>

//           {user ? (
//             <div className="relative">
//               <button
//                 onClick={() => setOpenUser(!openUser)}
//                 className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
//               >
//                 <FaUserCircle size={22} />
//                 {user.name}
//               </button>

//               {/* Dropdown */}
//               {openUser && (
//                 <div className="absolute right-0 mt-2 w-44 bg-white shadow-2xl rounded-2xl py-2 border border-gray-200 animate-fadeIn">
//                   <Link
//                     to="/profile"
//                     className="block px-5 py-3 hover:bg-indigo-50 transition rounded-lg"
//                     onClick={() => setOpenUser(false)}
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 font-medium transition rounded-lg"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link
//               to="/login"
//               className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md transition duration-300 font-semibold"
//             >
//               Login
//             </Link>
//           )}
//         </ul>

//         {/* Mobile Menu Icon */}
//         <button
//           className="md:hidden text-3xl text-gray-700 hover:text-indigo-600 transition duration-300"
//           onClick={() => setOpenMenu(!openMenu)}
//         >
//           {openMenu ? <HiX /> : <HiMenu />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {openMenu && (
//         <div className="md:hidden bg-white shadow-xl py-6 px-6 space-y-4 border-t border-gray-200 animate-fadeIn">
//           <Link
//             to="/"
//             className="block text-gray-700 text-lg hover:text-indigo-600 font-semibold transition"
//             onClick={() => setOpenMenu(false)}
//           >
//             Home
//           </Link>

//           <Link
//             to="/about"
//             className="block text-gray-700 text-lg hover:text-indigo-600 font-semibold transition"
//             onClick={() => setOpenMenu(false)}
//           >
//             About
//           </Link>

//           {user ? (
//             <>
//               <Link
//                 to="/profile"
//                 className="block text-gray-700 text-lg hover:text-indigo-600 font-semibold transition"
//                 onClick={() => setOpenMenu(false)}
//               >
//                 Profile
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left text-red-600 text-lg font-semibold hover:text-red-700 transition"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               className="block text-indigo-600 text-lg font-semibold hover:text-indigo-700 transition"
//               onClick={() => setOpenMenu(false)}
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

