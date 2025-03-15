import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AddPackages from "./AddPackages";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import toast, { Toaster } from 'react-hot-toast';

const AdminPanel = () => {

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

  const navItems = [
    { id: 1, name: "Bookings" },
    { id: 2, name: "Add Packages" },
    { id: 3, name: "All Packages" },
    { id: 4, name: "Users" },
    { id: 5, name: "Payments" },
    { id: 6, name: "Ratings/Reviews" },
    { id: 7, name: "History" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {currentUser ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-300 p-4">
              <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            </div>
            
            {/* Mobile dropdown */}
            <div className="md:hidden p-4 border-b border-gray-200">
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={activePanelId}
                onChange={(e) => setActivePanelId(Number(e.target.value))}
              >
                {navItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex flex-wrap border-b border-gray-200">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`py-4 px-6 text-center font-medium ${
                    activePanelId === item.id
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActivePanelId(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="p-6 bg-gray-50">
              {activePanelId === 1 && <AllBookings />}
              {activePanelId === 2 && <AddPackages />}
              {activePanelId === 3 && <AllPackages />}
              {activePanelId === 4 && <AllUsers />}
              {activePanelId === 5 && <Payments />}
              {activePanelId === 6 && <RatingsReviews />}
              {activePanelId === 7 && <History />}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please log in to access the admin panel.</p>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminPanel;