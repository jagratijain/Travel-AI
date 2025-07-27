import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';


const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/package/get-package-data/${params?.packageId}`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setPackageData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageRating: data?.packageData?.packageRating,
          packageTotalRatings: data?.packageData?.packageTotalRatings,
          packageImages: data?.packageData?.packageImages,
        });
        setLoading(false);
      } else {
        setError(data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get paymentgateway token
  const getToken = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const { data } = await axios.get(`${API_BASE_URL}/api/package/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [currentUser]);

  //handle payment & book package
  const handleBookPackage = async () => {
    if (
      bookingData.packageDetails === "" ||
      bookingData.buyer === "" ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      bookingData.date === ""
    ) {
      toast.error("All fields are required!")

      return;
    }
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/booking/book-package/${params?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        toast.success(data?.message)
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "bookings"}`);
        // setTimeout(()=>{
        // },1000)
      } else {
        setLoading(false);
        toast.error(data?.message)
        
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    let date = new Date().toISOString().substring(0, 10);
    let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * bookingData?.persons
          : packageData?.packagePrice * bookingData?.persons,
      });
    }
  }, [packageData, params]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
        {/* <h1 className="text-center font-bold text-3xl text-gray-800 mb-6">Book Package</h1> */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* User Info */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Information</h2>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700"
                value={currentUser.username}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700"
                value={currentUser.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                maxLength={200}
                id="address"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700 resize-none"
                value={currentUser.address}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                id="phone"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700"
                value={currentUser.phone}
                disabled
              />
            </div>
          </div>

          {/* Package Info */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Package Details</h2>
            <div className="flex items-start space-x-4">
              <img
                className="w-24 h-24 object-cover rounded-md"
                src={packageData.packageImages[0]}
                alt="Package image"
              />
              <div>
                <p className="font-semibold text-lg text-gray-800 capitalize">{packageData.packageName}</p>
                <p className="flex items-center gap-2 text-green-700 font-semibold capitalize">
                  <FaMapMarkerAlt /> {packageData.packageDestination}
                </p>
                {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaClock />
                    {+packageData.packageDays > 0 && `${packageData.packageDays} Day${packageData.packageDays > 1 ? 's' : ''}`}
                    {+packageData.packageDays > 0 && +packageData.packageNights > 0 && " - "}
                    {+packageData.packageNights > 0 && `${packageData.packageNights} Night${packageData.packageNights > 1 ? 's' : ''}`}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="date">Select Date</label>
              <input
                type="date"
                min={currentDate !== "" ? currentDate : ""}
                id="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-700">Price:</p>
              {packageData.packageOffer ? (
                <div className="flex items-center">
                  <span className="line-through text-gray-500 mr-2">Rs. {packageData.packagePrice}</span>
                  <span className="text-green-700 font-bold">Rs. {packageData.packageDiscountPrice}</span>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {Math.floor(((+packageData.packagePrice - +packageData.packageDiscountPrice) / +packageData.packagePrice) * 100)}% Off
                  </span>
                </div>
              ) : (
                <span className="text-green-700 font-bold">Rs. {packageData.packagePrice}</span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold text-gray-700">Persons:</p>
              <div className="flex border rounded-md">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => {
                    if (bookingData.persons > 1) {
                      setBookingData({
                        ...bookingData,
                        persons: bookingData.persons - 1,
                        totalPrice: packageData.packageDiscountPrice
                          ? packageData.packageDiscountPrice * (bookingData.persons - 1)
                          : packageData.packagePrice * (bookingData.persons - 1),
                      });
                    }
                  }}
                >
                  -
                </button>
                <input
                  value={bookingData.persons}
                  disabled
                  type="text"
                  className="w-12 text-center"
                />
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => {
                    if (bookingData.persons < 10) {
                      setBookingData({
                        ...bookingData,
                        persons: bookingData.persons + 1,
                        totalPrice: packageData.packageDiscountPrice
                          ? packageData.packageDiscountPrice * (bookingData.persons + 1)
                          : packageData.packagePrice * (bookingData.persons + 1),
                      });
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-xl font-semibold text-gray-700">
              Total Price: <span className="text-green-700">Rs. {bookingData.totalPrice}</span>
            </p>

            <div className="space-y-4">
              <p className={`font-semibold ${instance && "text-red-700 text-sm"}`}>
                Payment: {!instance ? "Loading..." : "Don't use your original card details! (This is just a personal project.)"}
              </p>
              {clientToken && (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    onClick={handleBookPackage}
                    disabled={loading || !instance}
                  >
                    {loading ? "Processing..." : "Book Now"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Booking;
