import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
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

  const handleProfilePhoto = (photo) => {
    try {
      dispatch(updateUserStart());
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-photos/${photoname}`); //profile-photos - folder name in firebase
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          //   console.log(progress);
          setPhotoPercentage(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
            const res = await fetch(
              `${API_BASE_URL}/api/user/update-profile-photo/${currentUser._id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": " application/json",
                },
                credentials:"include",
                body: JSON.stringify({ avatar: downloadUrl }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              
              toast.success(data?.message)
              setFormData({ ...formData, avatar: downloadUrl });
              dispatch(updateUserSuccess(data?.user));
              setProfilePhoto(null);
              return;
            } else {
              dispatch(updateUserFailure(data?.message));
            }
            dispatch(updateUserFailure(data?.message));
            
            toast.success(data?.message)
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE_URL}/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
          credentials:"include"
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          
          toast.error("Something went wrong!")
          return;
        }
        dispatch(deleteUserAccountSuccess());
        
        toast.success(data?.message)
        navigate("/");

        // setTimeout(()=>{
        // },2000)
      } catch (error) {}
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {currentUser ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={(profilePhoto && URL.createObjectURL(profilePhoto)) || formData.avatar}
                    alt="Profile photo"
                    className="w-32 h-32 rounded-full object-cover cursor-pointer"
                    onClick={() => fileRef.current.click()}
                  />
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                  />
                  <label
                    htmlFor="photo"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    Change Photo
                  </label>
                </div>
                {profilePhoto && (
                  <button
                    onClick={() => handleProfilePhoto(profilePhoto)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    {loading ? `Uploading...(${photoPercentage}%)` : "Upload"}
                  </button>
                )}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Details</h2>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser.username}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser.address}</dd>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center">

                <Link
                  to="/profile/editprofile"
                  className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 border border-[#41A4FF] text-[#41A4FF] rounded-md hover:bg-[#41A4FF] hover:text-white transition-colors duration-200 text-center"
                >
                  Edit Profile
                </Link>

              <button
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                Delete account
              </button>
              </div>
            </div>
          </div>
        ) : 
        (
          <div className="text-center text-red-600 text-xl">Please log in to view your profile.</div>
        )}
      </div>
      
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default Profile;