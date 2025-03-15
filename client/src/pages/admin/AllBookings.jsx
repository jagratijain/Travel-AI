import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import debounce from 'lodash.debounce';

const AllBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/booking/get-currentBookings?searchTerm=${searchTerm}`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("An error occurred while fetching bookings.");
    }
  };

  const debouncedGetAllBookings = debounce(getAllBookings, 300);

  useEffect(() => {
    debouncedGetAllBookings();
    return () => {
      debouncedGetAllBookings.cancel();
    };
  }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        toast.success(data?.message)
        getAllBookings();
      } else {
        setLoading(false);
        toast.error(data?.message)
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred while canceling the booking.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">
        {loading && (
          <div className="flex justify-center items-center">
            <ClipLoader color="#4A90E2" loading={loading} size={35} />
          </div>
        )}
        {!loading && (
          <div className="w-full mb-4">
            <input
              className="border rounded-lg p-2 mb-2 w-full"
              type="text"
              placeholder="Search Username or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        {error && <h1 className="text-center text-xl text-red-600">{error}</h1>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <div className="hidden md:block"> {/* Desktop view */}
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Package</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking, i) => (
                    <tr key={i} className="text-center">
                      <td className="py-2 px-4 border-b">
                        <Link to={`/package/${booking?.packageDetails?._id}`}>
                          <div className="flex items-center">
                            <img
                              className="w-12 h-12 mr-2 rounded-full object-cover"
                              src={booking?.packageDetails?.packageImages[0]}
                              alt="Package"
                            />
                            <span className="hover:underline">
                              {booking?.packageDetails?.packageName}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-2 px-4 border-b">{booking?.buyer?.username}</td>
                      <td className="py-2 px-4 border-b">{booking?.buyer?.email}</td>
                      <td className="py-2 px-4 border-b">{booking?.date}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden"> {/* Mobile view */}
              {currentBookings.map((booking, i) => (
                <div key={i} className="mb-4 border rounded-lg p-4">
                  <div className="mb-2">
                    <Link to={`/package/${booking?.packageDetails?._id}`}>
                      <div className="flex items-center">
                        <img
                          className="w-12 h-12 mr-2 rounded-full object-cover"

                          src={booking?.packageDetails?.packageImages[0]}
                          alt="Package"
                        />
                        <span className="hover:underline font-semibold">
                          {booking?.packageDetails?.packageName}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Username:</strong> {booking?.buyer?.username}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Email:</strong> {booking?.buyer?.email}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Date:</strong> {booking?.date}
                  </div>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="w-full p-2 rounded bg-red-500 text-white hover:opacity-95 mt-4"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AllBookings;