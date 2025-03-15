import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import toast, { Toaster } from 'react-hot-toast';


const AdminUpdateProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      toast.error("Change atleast 1 field to update details")
      return;
    }
    try {
      dispatch(updateUserStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updateUserFailure(data?.messsage));

        toast.error("Session Ended! Please login again")
        navigate("/login");
        return;
      }
      if (data.success && res.status === 201) {
        
        toast.success(data?.message)
        dispatch(updateUserSuccess(data?.user));
        return;
      }
      toast(data?.message, {
        icon: "ℹ️",
      });
      
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (
      updatePassword.oldpassword === "" ||
      updatePassword.newpassword === ""
    ) {
      toast.error("Enter a valid password")
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      toast.error("New password can't be same!")
      return;
    }
    try {
      dispatch(updatePassStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        credentials:"include",
        
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updatePassFailure(data?.message));
        toast.error("Session Ended! Please login again")
        navigate("/login");
        return;
      }
      dispatch(updatePassSuccess());
      
      toast(data?.message, {
        icon: "ℹ️",
      });
      
      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center w-full p-4 bg-gray-100">
      {updateProfileDetailsPanel === true ? (
        <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl text-center font-semibold mb-4">
            Update Profile
          </h1>
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="username" className="font-semibold mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="p-2 rounded border border-gray-300"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="address" className="font-semibold mb-1">
              Address:
            </label>
            <textarea
              maxLength={200}
              id="address"
              className="p-2 rounded border border-gray-300 resize-none"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="phone" className="font-semibold mb-1">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              className="p-2 rounded border border-gray-300"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            onClick={updateUserDetails}
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 mb-2"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <button
            disabled={loading}
            type="button"
            onClick={() => setUpdateProfileDetailsPanel(false)}
            className="w-full p-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            {loading ? "Loading..." : "Change Password"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl text-center font-semibold mb-4">
            Change Password
          </h1>
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="oldpassword" className="font-semibold mb-1">
              Enter old password:
            </label>
            <input
              type="password"
              id="oldpassword"
              className="p-2 rounded border border-gray-300"
              value={updatePassword.oldpassword}
              onChange={handlePass}
            />
          </div>
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="newpassword" className="font-semibold mb-1">
              Enter new password:
            </label>
            <input
              type="password"
              id="newpassword"
              className="p-2 rounded border border-gray-300"
              value={updatePassword.newpassword}
              onChange={handlePass}
            />
          </div>
          <button
            disabled={loading}
            onClick={updateUserPassword}
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 mb-2"
          >
            {loading ? "Loading..." : "Update Password"}
          </button>
          <button
            disabled={loading}
            onClick={() => {
              setUpdateProfileDetailsPanel(true);
              setUpdatePassword({
                oldpassword: "",
                newpassword: "",
              });
            }}
            type="button"
            className="w-full p-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            {loading ? "Loading..." : "Back"}
          </button>
        </div>
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default AdminUpdateProfile;
