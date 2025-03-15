import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../redux/user/userSlice.js";

const Signup = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signupStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      if (res?.data?.success) {
        
        dispatch(signupSuccess(res?.data?.user)); // Assuming the API returns user data
        toast.success(res?.data?.message);
        navigate("/login");
      } else {
        dispatch(signupFailure(res?.data?.message));
        toast.error(res?.data?.message);
      }
    } catch (error) {
      dispatch(signupFailure(error.message));
      console.log(error);
      toast.error("An error occurred during signup");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100 py-10 px-5">
      <div className="flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white w-full max-w-4xl">
        {/* Signup form */}
        <div className="flex flex-col justify-center p-8 w-full lg:w-1/2">
          <div className="w-full">
            <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
            <p className="text-gray-500 mb-6">Please enter your details to sign up</p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter your username" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-1" htmlFor="phone">Phone</label>
                <input type="tel" id="phone" placeholder="Enter your phone number" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} pattern="[0-9]{10}" title="Phone number should be of 10 digits"/>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-center text-white bg-[#41A4FF] hover:bg-[#41A4FF] py-2 rounded-md mb-4 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
              
            </form>
            {/* {error && <p className="text-sm text-center text-red-600 mt-3">{error}</p>} */}
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">Already have an account?</span>
              <Link to="/login" className="text-sm font-semibold text-[#41A4FF] ml-1">Sign in</Link>
            </div>
          </div>
        </div>

        {/* Signup banner - only visible on larger screens */}
        <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/login.jpg')" }}>
          {/* Overlay for better text contrast */}
          <div className="w-full h-fullopacity-50"></div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default Signup;
