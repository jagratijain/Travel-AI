import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import debounce from 'lodash.debounce';

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    setShowMoreBtn(false);

    try {
      setLoading(true);
      let url =
        filter === "offer"
          ? `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&offer=true`
          : filter === "latest"
            ? `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&sort=createdAt`
            : filter === "top"
              ? `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}&sort=packageRating`
              : `${API_BASE_URL}/api/package/get-packages?searchTerm=${search}`;
      const res = await fetch(url, {
        credentials: "include"
      });
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        if (data?.packages?.length > 8) {
          setShowMoreBtn(true);
        } else {
          setShowMoreBtn(false);
        }
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(data?.message || "Something went wrong!")
      }
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

  const handleDelete = async (packageId) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/package/delete-package/${packageId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await res.json();

      toast.success(data?.message);
      getPackages();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete package");
    } finally {
      setLoading(false);
    }
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
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
          <>
            <div className="w-full mb-4">
              <input
                className="border rounded-lg p-2 mb-2 w-full"
                type="text"
                placeholder="Search packages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 my-2 py-2 border-y-2">
              {["all", "offer", "latest", "top"].map((option) => (
                <button
                  key={option}
                  className={`cursor-pointer hover:scale-95 border rounded-xl p-2 px-12 transition-all duration-300 ${filter === option ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => setFilter(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="overflow-x-auto">
          <div className="hidden md:block"> {/* Desktop view */}
            {packages.map((pack, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 flex justify-between items-center hover:bg-gray-50 transition-all duration-300">
                <Link to={`/package/${pack._id}`} className="flex items-center">
                  <img src={pack?.packageImages[0]} alt="Package" className="w-20 h-20  mr-4 object-cover  rounded-full" />
                  <span className="font-semibold hover:underline">{pack?.packageName}</span>
                </Link>
                <div className="flex gap-2">
                  <Link to={`/profile/admin/update-package/${pack._id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(pack?._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden"> {/* Mobile view */}
            {packages.map((pack, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 hover:bg-gray-50 transition-all duration-300">
                <Link to={`/package/${pack._id}`} className="flex items-center mb-2">
                  <img src={pack?.packageImages[0]} alt="Package" className="w-16 h-16  mr-3 object-cover  rounded-full" />
                  <span className="font-semibold hover:underline">{pack?.packageName}</span>
                </Link>
                <div className="flex justify-end gap-2 mt-2">
                  <Link to={`/profile/admin/update-package/${pack._id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(pack?._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!loading && packages.length === 0 && (
          <p className="text-center">No packages found.</p>
        )}
        {showMoreBtn && (
          <div className="flex justify-center mt-8 mb-12">
            <button
              onClick={onShowMoreSClick}
              className="bg-[#41A4FF] text-white py-3 px-10 rounded-lg hover:bg-[#3B93E6] transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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

export default AllPackages;