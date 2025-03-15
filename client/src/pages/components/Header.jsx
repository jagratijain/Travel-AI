import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { FaCaretDown, FaHome, FaSuitcase, FaUser } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import defaultProfileImg from "../../assets/images/profile.png";

import {
  clearOTP,
  logOutFailure,
  logOutStart,
  logOutSuccess,
} from "../../redux/user/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      setIsDropdownOpen(false)
      dispatch(clearOTP());
      toast.success(data?.message)
      navigate("/login");
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate(`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white text-gray-900 py-4 px-6 flex justify-between items-center shadow-md">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <Link to="/" className="flex items-center gap-0">
              <span className="text-[#41A4FF]">Travel</span>
              <span>AI</span>
            </Link>
          </h1>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          onClick={toggleNav}
          className="block md:hidden text-gray-800 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isNavOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* Navigation links */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <ul className="flex flex-col md:flex-row md:items-center gap-6">
            <li>
              <Link to="/" className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname === "/" ? "text-[#41A4FF]" : ""}`}>
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/packages" className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname.includes("/packages") ? "text-[#41A4FF]" : ""}`}>
              <MdOutlineTravelExplore size={20} />
                <span>Packages</span>
              </Link>
            </li>
            {currentUser && (
              <li>
                <Link
                  to={`/profile/${currentUser.user_role === 1 ? "dashboard" : "bookings"}`}
                  className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname.includes(currentUser.user_role === 1 ? "/dashboard" : "/bookings") ? "text-[#41A4FF]" : ""
                    }`}
                >
                  <FaSuitcase />
                  <span>{currentUser.user_role === 1 ? "Admin Panel" : "Bookings"}</span>
                </Link>
              </li>
            )}
            <li>
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center gap-2 hover:text-[#41A4FF] ${
                      location.pathname.includes(currentUser.user_role === 1 ? "/admin" : "/user") ? "text-[#41A4FF]" : ""
                    }`}
                  >
                    <img
                      src={currentUser.avatar || defaultProfileImg}
                      alt={currentUser.username}
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <span>{currentUser.username}</span>
                    <FaCaretDown />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname === "/login" ? "text-[#41A4FF]" : ""}`}>
                  <FaUser />
                  <span>Login</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <Toaster position="top-center" reverseOrder={false} />
      </header>

      {/* Mobile navigation dropdown */}
      {isNavOpen && (
        <nav className="md:hidden bg-white shadow-md py-4 px-6 absolute w-full z-10">
          <ul className="flex flex-col items-center gap-6">
            <li>
              <Link
                to="/"
                className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname === "/" ? "text-[#41A4FF]" : ""}`}
                onClick={() => setIsNavOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/packages"
                className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname.includes("/packages") ? "text-[#41A4FF]" : ""}`}
                onClick={() => setIsNavOpen(false)}
              >
                <MdOutlineTravelExplore />

                <span>Packages</span>
              </Link>
            </li>
            {currentUser && (
              <li>
                <Link
                  to={`/profile/${currentUser.user_role === 1 ? "dashboard" : "bookings"}`}
                  className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname.includes(currentUser.user_role === 1 ? "/dashboard" : "/bookings") ? "text-[#41A4FF]" : ""
                    }`}
                  onClick={() => setIsNavOpen(false)}
                >
                  <FaSuitcase />
                  <span>{currentUser.user_role === 1 ? "Admin Panel" : "Bookings"}</span>
                </Link>
              </li>
            )}
            <li>
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center gap-2 hover:text-[#41A4FF] ${location.pathname.includes(currentUser.user_role === 1 ? "/admin" : "/user") ? "text-[#41A4FF]" : ""
                      }`}
                  >
                    <img
                      src={currentUser.avatar || defaultProfileImg}
                      alt={currentUser.username}
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <span>{currentUser.username}</span>
                    <FaCaretDown />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname === "/login" ? "text-[#41A4FF]" : ""}`} onClick={() => setIsNavOpen(false)}>
                  <FaUser />
                  <span>Login</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Header;
