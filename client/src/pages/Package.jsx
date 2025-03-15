import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaClock,
  FaMapMarkerAlt,
  FaShare,
  FaBed,
  FaUtensils,
  FaCar,
  FaHiking,
} from "react-icons/fa";

import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";
import Chat from "./user/Chat";
import "./styles/Chat.css";
import toast from "react-hot-toast";
import { ClipLoader } from 'react-spinners';

const Package = () => {
  SwiperCore.use([Navigation]);
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
  const [copied, setCopied] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [showChat, setShowChat] = useState(false); 

  const handleCloseChat = () => {
    setShowChat(false);
  };


  const getPackageData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/package/get-package-data/${params?.id}`, {
        credentials: "include"
      });
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

  const giveRating = async () => {
    checkRatingGiven();
    if (ratingGiven) {
      // alert("You already submittd your rating!");
      toast('You already submitted your rating!', {
        icon: "ℹ️",
      });
      return;
    }
    if (ratingsData.rating === 0 && ratingsData.review === "") {
      // alert("Atleast 1 field is required!");
      toast.error("Atleast 1 field is required!")
      return;
    }
    if (
      ratingsData.rating === 0 &&
      ratingsData.review === "" &&
      !ratingsData.userRef
    ) {
      // alert("All fields are required!");
      toast.error("All fields are required!")
      return;
    }
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/rating/give-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        // alert(data?.message);
        toast.success(data?.message)
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        toast.error(data?.message || "Something went wrong!")
        // alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRatings = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/rating/get-ratings/${params.id}/4`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data) {
        setPackageRatings(data);
      } else {
        setPackageRatings("No ratings yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/rating/rating-given/${currentUser?._id}/${params?.id}`, {
        credentials: "include"
      }
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  const handleExploreClick = () => {
    if (currentUser) {
      setShowChat(true);
    } else {
      toast("Please sign in to use this feature", {
        icon: "ℹ️",
      });
      navigate('/login');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center">
            <ClipLoader color="#4A90E2" loading={loading} size={35} />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-4 bg-red-100 p-6 rounded-lg">
            <p className="text-center text-red-700 font-semibold">{error}</p>
            <Link
              className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition duration-300"
              to="/"
            >
              Back to Home
            </Link>
          </div>
        )}

        {packageData && !loading && !error && (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="relative">
              <Swiper
                navigation
                className="aspect-[16/9] w-full"
              >
                {packageData?.packageImages.map((imageUrl, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation and share buttons */}
              <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
                <button
                  onClick={() => navigate("/packages")}
                  className="bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition duration-300"
                >
                  <FaArrowLeft className="text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition duration-300"
                >
                  <FaShare className="text-slate-600" />
                </button>
              </div>
              {copied && (
                <>
                  {toast.success("Link copied!")}
                </>

              )}
            </div>

            {/* Package Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Package Title and Location */}
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold capitalize mb-2">{packageData?.packageName}</h1>
                <p className="text-green-700 flex justify-center items-center gap-2 text-lg sm:text-xl">
                  <FaMapMarkerAlt />
                  {packageData?.packageDestination}
                </p>
              </div>

              {/* Price and Duration */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg gap-4 sm:gap-0">
                <div className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
                  {packageData?.packageOffer ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <span className="line-through text-gray-500">Rs. {packageData?.packagePrice}</span>
                      <span className="text-green-600">Rs. {packageData?.packageDiscountPrice}</span>
                      <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">
                        {Math.floor(((+packageData?.packagePrice - +packageData?.packageDiscountPrice) / +packageData?.packagePrice) * 100)}% Off
                      </span>
                    </div>
                  ) : (
                    <span>Rs. {packageData?.packagePrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock />
                  <span>
                    {+packageData?.packageDays > 0 && `${packageData?.packageDays} ${+packageData?.packageDays > 1 ? "Days" : "Day"}`}
                    {+packageData?.packageDays > 0 && +packageData?.packageNights > 0 && " - "}
                    {+packageData?.packageNights > 0 && `${packageData?.packageNights} ${+packageData?.packageNights > 1 ? "Nights" : "Night"}`}
                  </span>
                </div>
              </div>

              {/* Rating */}
              {packageData?.packageTotalRatings > 0 && (
                <div className="flex justify-center items-center bg-yellow-100 p-3 rounded-lg">
                  <Rating value={packageData?.packageRating || 0} readOnly precision={0.1} />
                  <p className="ml-2 font-semibold">({packageData?.packageTotalRatings} ratings)</p>
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700" id="desc">
                  {packageData?.packageDescription.length > 150
                    ? packageData?.packageDescription.substring(0, 150) + "..."
                    : packageData?.packageDescription}
                </p>
                {packageData?.packageDescription.length > 150 && (
                  <button
                    id="moreBtn"
                    onClick={() => {
                      document.getElementById("desc").innerText = packageData?.packageDescription;
                      document.getElementById("moreBtn").style.display = "none";
                      document.getElementById("lessBtn").style.display = "block";
                    }}
                    className="mt-2 text-green-600 hover:underline flex items-center gap-1"
                  >
                    Read more <FaArrowDown />
                  </button>
                )}
                <button
                  id="lessBtn"
                  style={{ display: "none" }}
                  onClick={() => {
                    document.getElementById("desc").innerText = packageData?.packageDescription.substring(0, 150) + "...";
                    document.getElementById("lessBtn").style.display = "none";
                    document.getElementById("moreBtn").style.display = "block";
                  }}
                  className="mt-2 text-green-600 hover:underline flex items-center gap-1"
                >
                  Show less <FaArrowUp />
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => currentUser ? navigate(`/booking/${params?.id}`) : navigate("/login")}
                  className="flex-1 bg-green-600 text-white rounded-lg py-3 font-semibold hover:bg-green-700 transition duration-300"
                >
                  Book Now
                </button>
                <button
                  // onClick={() => currentUser ? setShowChat(true):navigate("/login")}
                  onClick={handleExploreClick}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Explore Place
                </button>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <PackageDetailCard icon={<FaBed />} title="Accommodation" content={packageData?.packageAccommodation} />
                <PackageDetailCard icon={<FaHiking />} title="Activities" content={packageData?.packageActivities} />
                <PackageDetailCard icon={<FaUtensils />} title="Meals" content={packageData?.packageMeals} />
                <PackageDetailCard icon={<FaCar />} title="Transportation" content={packageData?.packageTransportation} />
              </div>

              {/* Ratings and Reviews */}
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Ratings & Reviews</h2>
                {currentUser && !ratingGiven && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <Rating
                      name="simple-controlled"
                      value={ratingsData?.rating}
                      onChange={(e, newValue) => setRatingsData({ ...ratingsData, rating: newValue })}
                      className="mb-4"
                    />
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                      rows={3}
                      placeholder="Write your review..."
                      value={ratingsData?.review}
                      onChange={(e) => setRatingsData({ ...ratingsData, review: e.target.value })}
                    ></textarea>
                    <button
                      onClick={giveRating}
                      disabled={(ratingsData.rating === 0 && ratingsData.review === "") || loading}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}
                <div className="space-y-4">
                  <RatingCard packageRatings={packageRatings} />
                  {packageData.packageTotalRatings > 4 && (
                    <button
                      onClick={() => navigate(`/package/ratings/${params?.id}`)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                    >
                      View All Reviews <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <Chat data={packageData} onClose={handleCloseChat} />
          </div>
        </div>
      )}
    </div>
  );
};

const PackageDetailCard = ({ icon, title, content }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-700">{content}</p>
  </div>
);

export default Package;