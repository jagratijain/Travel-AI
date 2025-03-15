import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import debounce from 'lodash.debounce';

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

    try {
      setLoading(true);
      let url =
        filter === "most"
          ? `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
          : `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&sort=packageRating`;
      const res = await fetch(url, {
        credentials: "include"
      });
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(data?.message || "Something went wrong!")
      }
      setShowMoreBtn(data?.packages?.length > 8);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const debouncedGetPackages = debounce(getPackages, 300);

  useEffect(() => {
    debouncedGetPackages();
    return () => {
      debouncedGetPackages.cancel();
    };
  }, [filter, search]);

  const onShowMoreClick = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const startIndex = packages.length;
    let url =
      filter === "most"
        ? `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`;
    const res = await fetch(url, {
      credentials: "include"
    });
    const data = await res.json();
    setShowMoreBtn(data?.packages?.length === 9);
    setPackages([...packages, ...data?.packages]);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2 bg-white">
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
              placeholder="Search packages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex justify-center gap-4 my-2 py-2 border-y-2">
              <button
                className={`cursor-pointer hover:scale-95 border rounded-xl p-2 px-12 transition-all duration-300 ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`cursor-pointer hover:scale-95 border rounded-xl p-2 px-12 transition-all duration-300 ${filter === "most" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={() => setFilter("most")}
              >
                Most Rated
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <div className="hidden md:block"> {/* Desktop view */}
            {packages.map((pack, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 flex justify-between items-center hover:bg-gray-50 transition-all duration-300">
                <Link to={`/package/ratings/${pack._id}`} className="flex items-center">
                  <img src={pack?.packageImages[0]} alt="Package" className="w-20 h-20 mr-4 object-cover  rounded-full" />
                  <span className="font-semibold hover:underline">{pack?.packageName}</span>
                </Link>
                <div className="flex items-center">
                  <Rating value={pack?.packageRating} precision={0.1} readOnly />
                  <span className="ml-2">({pack?.packageTotalRatings})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden"> {/* Mobile view */}
            {packages.map((pack, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 hover:bg-gray-50 transition-all duration-300">
                <Link to={`/package/ratings/${pack._id}`} className="flex items-center mb-2">
                  <img src={pack?.packageImages[0]} alt="Package" className="w-16 h-16  mr-3 object-cover  rounded-full" />
                  <span className="font-semibold hover:underline">{pack?.packageName}</span>
                </Link>
                <div className="flex items-center justify-end">
                  <Rating value={pack?.packageRating} precision={0.1} readOnly size="small" />
                  <span className="ml-2 text-sm">({pack?.packageTotalRatings})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!loading && packages.length === 0 && (
          <p className="text-center">No packages found.</p>
        )}
        {showMoreBtn && (
          <div className="flex justify-center mt-6 mb-4">
            <button
              onClick={onShowMoreClick}
              className="bg-[#41A4FF] text-white hover:bg-[#41A4FF] transition-colors duration-300 py-3 px-10 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Show More
            </button>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default RatingsReviews;