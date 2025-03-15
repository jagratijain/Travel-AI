import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyBookings from "./user/MyBookings";
import MyHistory from "./user/MyHistory";
import toast, { Toaster } from 'react-hot-toast';


const Bookings = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

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

 
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {currentUser ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-300 p-4">
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            </div>
            <nav className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activePanelId === 1
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActivePanelId(1)}
              >
                Bookings
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activePanelId === 2
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActivePanelId(2)}
              >
                History
              </button>
            </nav>
            <div className="p-6">
              {activePanelId === 1 && <MyBookings />}
              {activePanelId === 2 && <MyHistory />}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please log in to view your bookings and history.</p>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Bookings;
