import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearOTP, setGENOTP, updateUserSuccess } from "../../redux/user/userSlice";

import toast, { Toaster } from 'react-hot-toast';

const VerifyUser = () => {
  const dispatch = useDispatch()
  const [isDisabled, setIsDisabled] = useState(true);
  const { currentUser, loading, error, otpgen } = useSelector((state) => state.user);

  const [showToast, setShowToast] = useState(false);
  const [successChange, setSuccessChange] = useState(0);
  const location = useLocation();
  const uid = location.state?.uid;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  const [otp, setOtp] = useState("")
  const [isOtpValid, setIsOtpValid] = useState(true);

  useEffect(() => {
    checkOTPValidity();
  }, []);

  const checkOTPValidity = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/check-otp/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setIsOtpValid(data.success);
      if (!data.success) {
        toast.error(data.message);
        await generateNewOTP();
      }
    } catch (error) {
      console.error("Error checking OTP validity:", error);
      toast.error("Failed to check OTP validity");
    }
  };

  const generateNewOTP = async () => {
    try {
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/update-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: currentUser._id, otp: newOTP, expiresAt }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setGENOTP(newOTP));
        navigations(newOTP)
        
        toast("A new OTP has been sent to your email.", {
          icon: "ℹ️",
        });
        
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error generating new OTP:", error);
      toast.error("Failed to generate new OTP");
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
      console.log("Email sent successfully.");
    } catch (error) {
      console.log(error);
      console.error("Error sending email:", error);

      return;
    }
  };

  async function navigations(sixDigitCode) {

    
    const email = formData.email
    
    const name = formData.username
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
    // dispatch(setGENOTP(sixDigitCode)); 

  }



  useEffect(() => {
    console.log(otpgen);
    console.log(currentUser);
  }, [otpgen])

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (showToast && isDisabled) {
      
      toast("Enter the OTP sent to your Email", {
        icon: "ℹ️",
      });
      setShowToast(false);
    }
  }, [showToast]);





  const handleSubmit = async () => {
    if (otp.length === 6) {
      if (otp === otpgen) {
        try {
          console.log(currentUser);
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
          const res = await fetch(`${API_BASE_URL}/api/user/verify-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ userId: currentUser._id, otp }),
          });
          const data = await res.json();

          if (data.success) {
            toast.success("User verified successfully!");
            dispatch(clearOTP());
            // dispatch(verifyOTP(data.user));
            dispatch(updateUserSuccess({ ...data.user, isVerified: true }));
            navigate("/"); // or wherever you want to redirect after successful verification
          } else {
            toast.error(data.message || "Verification failed. Please try again.");
            if (data.message === "OTP has expired") {
              await generateNewOTP();
            }
          }
        } catch (error) {
          toast.error("An error occurred. Please try again.");
          console.error(error);
        }
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } else {
      toast.error("Please enter a 6-digit OTP.");
    }
  };


    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify Your Account</h2>
          <p className="text-center text-gray-600 mb-6">
            We've sent a verification code to your email. Please enter it below.
          </p>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span className="w-2"></span>}
            renderInput={(props) => <input {...props} />}
            // inputStyle="w-12 h-12 text-center text-2xl border rounded-md focus:outline-none focus:border-blue-500"
            inputStyle={{
              width: '50px', 
              height: '50px',
              fontSize: '20px',
              textAlign: 'center',
              margin: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            containerStyle="flex justify-between mb-6"
          />
          <button
            onClick={handleSubmit}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={otp.length !== 6}
          >
            Verify
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button onClick={generateNewOTP} className="text-blue-600 hover:underline focus:outline-none">
              Resend
            </button>
          </p>
        </div>
        
        <Toaster
        position="top-center"
        reverseOrder={false}
      />
      </div>
    );
};

export default VerifyUser