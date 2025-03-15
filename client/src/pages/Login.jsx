import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  setGENOTP
} from "../redux/user/userSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        
        toast.success("Login Successful")
        if (!data?.user?.isVerified){
          await generateAndUpdateOTP(data?.user._id);
          navigate("/verifyuser");
        }
        else{
          navigate("/");
        }
        
      } else {
        dispatch(loginFailure(data?.message));
        toast.error(data?.message);  

      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
  };

  const generateAndUpdateOTP = async (userId) => {
    const sixDigitCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    dispatch(setGENOTP(sixDigitCode));
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/update-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId, otp: sixDigitCode, expiresAt: expiresAt.toISOString() }),
      });
      
      const data = await res.json();
      if (data.success) {
        await navigations(sixDigitCode);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating OTP:", error);
      toast.error("Failed to generate OTP. Please try again.");
    }
  };

  const sendOTP = async (to, subject, html) => {
    try {
      
      // const html = "Welcome to travel AI!"

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, subject, html }),

        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      
    } catch (error) {
      console.log(error);
      console.error("Error sending email:", error);

      return;
    }
  };

  async function navigations(sixDigitCode) {

    // const sixDigitCode = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();

    // setGeneratedOTP(sixDigitCode)
    


    const email = formData.email
    const name = formData.email
    const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verification Code | OnClique</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
              }

              .heading {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
              }

              .text {
                font-size: 16px;
                color: #555;
                line-height: 1.5;
                margin-bottom: 20px;
              }

              .textFooter {
                font-size: 13px;
                color: #555;
                line-height: 1;
                margin-bottom: 7px;
              }

              .code {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 4px;
                display: inline-block;
                margin-bottom: 20px;
              }

              .footer {
                font-size: 14px;
                color: #777;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="heading">Hello ${name},</h1>
              <p class="text">
                Thank you for registering on Travel AI! Please use the verification code below to complete your registration. If you did not request this code, please ignore this email.
              </p>
              <center><div class="code">${sixDigitCode}</div></center>
              <p class="text">
                If you have any questions or need assistance, please revert to this email.
              </p>
              <div class="footer">
                <p class="textFooter">Regards,</p>
                <strong><p class="textFooter">Travel AI</p></strong>
              </div>
            </div>
          </body>
        </html>
        `;

    sendOTP(email, "Verification Code | Travel AI", emailTemplate);
    dispatch(setGENOTP(sixDigitCode)); // Dispatch the generated OTP

  }

  return (
    <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-100 py-10">
      <div className="flex shadow-md">
        <div className="flex flex-wrap content-center justify-center rounded-md bg-white w-full md:w-[24rem] p-5 md:p-0" style={{ height: "auto", minHeight: "32rem" }}>
          <div className="w-full md:w-72">
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <small className="text-gray-400">Welcome back! Please enter your details</small>

            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="mb-2 block text-xs font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="mb-2 block text-xs font-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700"
                  onChange={handleChange}
                  required
                />
              </div>

              

              <div className="mb-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-center text-white bg-[#41A4FF] hover:bg-[#41A4FF] py-2 rounded-md mb-4 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                
              </div>
            </form>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-500">Don't have account?</span>
              <Link to="/signup" className="text-sm font-semibold text-[#41A4FF] ml-1">Sign up</Link>
            </div>

            {/* {error && <p className="text-sm text-center text-red-600 mt-3">{error}</p>} */}
          </div>
        </div>

        <div className="hidden md:flex md:flex-wrap content-center justify-center rounded-r-md" style={{ width: "24rem", height: "32rem" }}>
          <img className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md" src="images/login.jpg" alt="Login banner" />
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </div>
  );
};

export default Login;