import React, { useEffect, useState } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from 'react-hot-toast';

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getPackageData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

      const res = await fetch(`${API_BASE_URL}/api/package/get-package-data/${params?.id}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data?.success) {
        // console.log(data);
        setFormData({
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
          packageImages: data?.packageData?.packageImages,
        });
      } else {
        toast.error(data?.message || "Something went wrong!")
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleImageSubmit = () => {
    if (
      images.length > 0 &&
      images.length + formData.packageImages.length < 6
    ) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            packageImages: formData.packageImages.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per package");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadPercent(Math.floor(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) {

      toast.error("You must upload atleast 1 image")
      return;
    }
    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      toast.error("All fields are required!")
      return;
    }
    if (formData.packagePrice < 0) {
      toast.error("Price should be greater than 500!")
      return;
    }
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      toast.error("Regular Price should be greater than Discount Price!")
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }
    try {
      setLoading(true);
      setError(false);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

      const res = await fetch(`${API_BASE_URL}/api/package/update-package/${params?.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
      }
      setLoading(false);
      setError(false);

      toast.success(data?.message)
      // getPackageData();
      // setImages([]);
      navigate(`/package/${params?.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Update Package</h1> */}
        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-grow space-y-6 bg-white shadow-lg rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="packageName"
                  value={formData?.packageName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
                />
              </div>
              <div>
                <label htmlFor="packageDestination" className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  id="packageDestination"
                  value={formData.packageDestination}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="packageDescription" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="packageDescription"
                value={formData.packageDescription}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="packageDays" className="block text-sm font-medium text-gray-700">Days</label>
                <input
                  type="number"
                  id="packageDays"
                  value={formData.packageDays}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
                />
              </div>
              <div>
                <label htmlFor="packageNights" className="block text-sm font-medium text-gray-700">Nights</label>
                <input
                  type="number"
                  id="packageNights"
                  value={formData.packageNights}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="packageAccommodation" className="block text-sm font-medium text-gray-700">Accommodation</label>
              <textarea
                id="packageAccommodation"
                value={formData.packageAccommodation}
                onChange={handleChange}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
              />
            </div>

            <div>
              <label htmlFor="packageTransportation" className="block text-sm font-medium text-gray-700">Transportation</label>
              <select
                id="packageTransportation"
                onChange={handleChange}
                value={formData.packageTransportation}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
              >
                <option value="">Select</option>
                <option>Flight</option>
                <option>Train</option>
                <option>Bus</option>
                <option>Car</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="packageMeals" className="block text-sm font-medium text-gray-700">Meals</label>
              <textarea
                id="packageMeals"
                value={formData.packageMeals}
                onChange={handleChange}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
              />
            </div>

            <div>
              <label htmlFor="packageActivities" className="block text-sm font-medium text-gray-700">Activities</label>
              <textarea
                id="packageActivities"
                value={formData.packageActivities}
                onChange={handleChange}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
            <label htmlFor="packagePrice" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="packagePrice"
                  value={formData.packagePrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
                />
              </div>
              <div className="flex items-end mb-3">
                <input
                  type="checkbox"
                  id="packageOffer"
                  checked={formData?.packageOffer}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#3B93E6] focus:ring-[#3B93E6] border-gray-300 rounded"
                />
                <label htmlFor="packageOffer" className="ml-2 block text-sm text-gray-900">Offer</label>
              </div>
            </div>

            {formData.packageOffer && (
              <div>
                <label htmlFor="packageDiscountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
                <input
                  type="number"
                  id="packageDiscountPrice"
                  value={formData.packageDiscountPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B93E6] focus:border-[#3B93E6]"
                />
              </div>
            )}

            {(imageUploadError || error) && (
              <p className="text-red-600 text-sm">{imageUploadError || error}</p>
            )}

            <button
              disabled={uploading || loading}
              className="w-full bg-[#41A4FF] text-white py-2 px-4 rounded-md hover:bg-[#3B93E6] focus:outline-none focus:ring-2 focus:ring-[#3B93E6] focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              {uploading ? "Uploading..." : loading ? "Loading..." : "Update Package"}
            </button>
          </form>

          <div className="lg:w-1/3 bg-white shadow-lg rounded-lg p-6 space-y-6 h-fit">
            <div>
              <label htmlFor="packageImages" className="block text-sm font-medium text-gray-700">
                Images
                <span className="text-red-700 text-xs block">
                  (max 5 images, each less than 2MB)
                </span>
              </label>
              <input
                type="file"
                id="packageImages"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              />
            </div>

            {formData?.packageImages?.length > 0 && (
              <div className="space-y-2">
                {formData.packageImages.map((image, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <img src={image} alt="" className="h-16 w-16 object-cover rounded" />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={uploading || loading || images.length === 0}
              className="w-full bg-[#41A4FF] text-white py-2 px-4 rounded-md hover:bg-[#3B93E6] focus:outline-none focus:ring-2 focus:ring-[#3B93E6] focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
              type="button"
              onClick={handleImageSubmit}
            >
              {uploading
                ? `Uploading... (${imageUploadPercent}%)`
                : loading
                  ? "Loading..."
                  : "Upload Images"}
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default UpdatePackage;
