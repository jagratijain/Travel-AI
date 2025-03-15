import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import debounce from 'lodash.debounce';

const Payments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const [showMoreBtn, setShowMoreBtn] = useState(false);


  const getAllBookings = async () => {
    try {
      setLoading(true);
      setShowMoreBtn(false);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/booking/get-allBookings?searchTerm=${search}`, {
        credentials: "include"
      }
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
        if (data?.packages?.length > 8) {
          setShowMoreBtn(true);
        } else {
          setShowMoreBtn(false);
        }
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
  }, [search]);

  const handleUserDelete = async (bookingId) => {
    const CONFIRM = window.confirm(
      "Are you sure? The details will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE_URL}/api/booking/delete-booking-history/${bookingId}/${currentUser._id}`, {
          method: "DELETE",
          credentials: "include"
        });

        const data = await res.json();
        if (data?.success) {
          toast.success(data?.message)
          getAllBookings();
        } else {
          toast.error("Something went wrong!")
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Something went wrong!")
      }
    }
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = allPackages.length;
    const startIndex = numberOfPackages;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const res = await fetch(`${API_BASE_URL}/api/package/get-packages?${searchQuery}`, {
      credentials: "include"
    });
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setAllBookings([...allBookings, ...data?.packages]);
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Total Price</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((booking, i) => (
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
                      <td className="py-2 px-4 border-b">{booking?.buyer?.email}</td>
                      <td className="py-2 px-4 border-b">{booking?.date}</td>
                      <td className="py-2 px-4 border-b">Rs. {booking?.totalPrice}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleUserDelete(booking?._id)}
                          className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden"> {/* Mobile view */}
              {allBookings.map((booking, i) => (
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
                  <div className="mb-2 text-sm">
                    <strong>Total Price:</strong> Rs. {booking?.totalPrice}
                  </div>
                  <button
                    onClick={() => handleUserDelete(booking?._id)}
                    className="w-full p-2 rounded bg-red-500 text-white hover:opacity-95 mt-4"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {showMoreBtn && (
          <div className="flex justify-center mt-8 mb-12">
            <button
              onClick={onShowMoreSClick}
              className="bg-[#41A4FF] text-white py-3 px-6 rounded-lg hover:bg-[#3B93E6] transition duration-300 ease-in-out shadow-md"
            >
              Show More
            </button>
          </div>
        )}
        {!loading && allBookings.length === 0 && (
          <p className="text-center">No payments found.</p>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Payments;