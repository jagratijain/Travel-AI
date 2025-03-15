import React, { useState } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast, { Toaster } from 'react-hot-toast';

const AddPackages = () => {
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
          console.log(err);
        });
    } else {
      setImageUploadError("You can only upload 5 images per package");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name.replace(/\s/g, "");
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
      toast.error("You must upload at least 1 image")
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
      
      toast.error("Regular Price should be greater than Discount Price!");
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }
    // console.log(formData);
    try {
      setLoading(true);
      setError(false);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/package/create-package`, {
        method: "POST",
        credentials:"include",
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
      
      toast(data?.message, {
        icon: "ℹ️",
      });
      
      setFormData({
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
      setImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center p-3">
        <form
          onSubmit={handleSubmit}
          className=" shadow-lg rounded-xl p-6 gap-4 flex flex-col items-center bg-white w-full max-w-screen-lg"
        >
          {/* <h1 className="text-center text-3xl font-bold text-red-500 mb-4">Add Package</h1> */}
          <div className="flex flex-col w-full mb-3 mt-3">
            <label htmlFor="packageName" className="text-lg font-semibold">Name:</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-2 mt-1 focus:border-blue-500 focus:outline-none"
              id="packageName"
              value={formData.packageName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageDescription" className="text-lg font-semibold">Description:</label>
            <textarea
              type="text"
              className="border border-gray-300 rounded p-2 mt-1 resize-none focus:border-blue-500 focus:outline-none"
              id="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageDestination" className="text-lg font-semibold">Destination:</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-2 mt-1 focus:border-blue-500 focus:outline-none"
              id="packageDestination"
              value={formData.packageDestination}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2 mb-3">
            <div className="flex flex-col flex-1">
              <label htmlFor="packageDays" className="text-lg font-semibold">Days:</label>
              <input
                type="number"
                className="border border-gray-300 rounded p-2 mt-1 focus:border-blue-500 focus:outline-none"
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="packageNights" className="text-lg font-semibold">Nights:</label>
              <input
                type="number"
                className="border border-gray-300 rounded p-2 mt-1 focus:border-blue-500 focus:outline-none"
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
                min={1}
              />
            </div>
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageAccommodation" className="text-lg font-semibold">Accommodation:</label>
            <textarea
              type="text"
              className="border border-gray-300 rounded p-2 mt-1 resize-none focus:border-blue-500 focus:outline-none"
              id="packageAccommodation"
              value={formData.packageAccommodation}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageTransportation" className="text-lg font-semibold">Transportation:</label>
            <select
              className="border border-gray-300 rounded-lg p-2 mt-1 focus:border-blue-500 focus:outline-none"
              id="packageTransportation"
              onChange={handleChange}
            >
              <option>Select</option>
              <option>Flight</option>
              <option>Train</option>
              <option>Bus</option>
              <option>Car</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageMeals" className="text-lg font-semibold">Meals:</label>
            <textarea
              type="text"
              className="border border-gray-300 rounded p-2 mt-1 resize-none focus:border-blue-500 focus:outline-none"
              id="packageMeals"
              value={formData.packageMeals}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageActivities" className="text-lg font-semibold">Activities:</label>
            <textarea
              type="text"
              className="border border-gray-300 rounded p-2 mt-1 resize-none focus:border-blue-500 focus:outline-none"
              id="packageActivities"
              value={formData.packageActivities}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packagePrice" className="text-lg font-semibold">Price:</label>
            <input
              type="number"
              className="border border-gray-300 rounded p-2 mt-1 focus:border-blue-500 focus:outline-none"
              id="packagePrice"
              min={1}
              value={formData.packagePrice}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 w-full mb-3">
            <label htmlFor="packageOffer" className="text-lg font-semibold">Offer:</label>
            <input
              type="checkbox"
              className="border border-gray-300 rounded w-4 h-4 mt-1 focus:border-blue-500 focus:outline-none"
              id="packageOffer"
              checked={formData.packageOffer}
              onChange={handleChange}
            />
          </div>
          <div className={`${formData.packageOffer ? "flex flex-col w-full mb-3" : "hidden"}`}>
            <label htmlFor="packageDiscountPrice" className="text-lg font-semibold">Discount Price:</label>
            <input
            min={1}
              type="number"
              className="border border-gray-300 rounded p-2 mt-1 focus:border-blue-500 focus:outline-none"
              id="packageDiscountPrice"
              value={formData.packageDiscountPrice}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="packageImages" className="text-lg font-semibold">
              Images:
              <span className="text-red-700 text-sm"> (images size should be less than 2mb and max 5 images)</span>
            </label>
            <input
              type="file"
              className="border border-gray-300 rounded p-2 mt-1"
              id="packageImages"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
          {imageUploadError || (error && <span className="text-red-600 w-full mb-3">{imageUploadError || error}</span>)}
          <button
            hidden={images.length === 0}
            disabled={uploading || loading}
            className="bg-[#41A4FF] p-3 rounded text-white hover:opacity-90 disabled:opacity-50 w-full mb-3"
            type="button"
            onClick={handleImageSubmit}
          >
            {uploading ? `Uploading...(${imageUploadPercent}%)` : loading ? "Loading..." : "Upload Images"}
          </button>
          <button
            disabled={uploading || loading || formData.packageImages.length === 0}
            className="bg-[#41A4FF] p-3 rounded text-white hover:opacity-90 disabled:opacity-50 w-full mb-3"
          >
            {uploading ? "Uploading..." : loading ? "Loading..." : "Add Package"}
          </button>
          {formData.packageImages.length > 0 && (
            <div className="p-3 w-full flex flex-col justify-center">
              {formData.packageImages.map((image, i) => {
                return (
                  <div key={i} className="shadow-lg rounded-lg p-1 flex flex-wrap my-2 justify-between items-center">
                    <img src={image} alt="" className="h-20 w-20 rounded object-cover" />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="p-2 text-red-500 hover:cursor-pointer hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
};

export default AddPackages;
