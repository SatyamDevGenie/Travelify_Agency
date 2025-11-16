import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaUserCircle } from "react-icons/fa";
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
    <nav className="bg-white/80 backdrop-blur-md shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-10">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-wide"
        >
          Travelify
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-gray-700 font-semibold">
          <li>
            <Link to="/" className="hover:text-indigo-600 duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-indigo-600 duration-300">
              About
            </Link>
          </li>

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenUser(!openUser)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 duration-300"
              >
                <FaUserCircle size={22} />
                {user.name}
              </button>

              {openUser && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-3 animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-5 py-3 hover:bg-indigo-50 rounded-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg duration-300"
            >
              Login
            </Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl text-gray-700 hover:text-indigo-600 duration-300"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {openMenu && (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-200 px-6 py-6 space-y-4 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setOpenMenu(false)}
            className="block text-lg font-semibold text-gray-700 hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setOpenMenu(false)}
            className="block text-lg font-semibold text-gray-700 hover:text-indigo-600"
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpenMenu(false)}
                className="block text-lg font-semibold text-gray-700 hover:text-indigo-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-lg text-red-600 font-semibold hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpenMenu(false)}
              className="block text-lg font-semibold text-indigo-600 hover:text-indigo-700"
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

