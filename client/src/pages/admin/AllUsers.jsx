import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import debounce from 'lodash.debounce';

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getUsers = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/getAllUsers?searchTerm=${search}`, {
        credentials: "include"
      });
      const data = await res.json();

      if (data && data.success === false) {
        setLoading(false);
        setError(data.message);
        setAllUsers([]);
      } else {
        setLoading(false);
        setAllUsers(data);
        setError("");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  };

  const debouncedGetUsers = debounce(getUsers, 300);

  useEffect(() => {
    debouncedGetUsers();
    return () => {
      debouncedGetUsers.cancel();
    };
  }, [search]);

  const handleUserDelete = async (userId) => {
    const CONFIRM = window.confirm(
      "Are you sure? The account will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE_URL}/api/user/delete-user/${userId}`, {
          method: "DELETE",
          credentials: "include"
        });
        
        const data = await res.json();
        setLoading(false);
        toast.success(data.message);
        getUsers();
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Something went wrong. Please try again later.");
      }
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
              placeholder="Search by name, email, or phone..."
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
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Address</th>
                    <th className="py-2 px-4 border-b">Phone</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user._id} className="text-center">
                      <td className="py-2 px-4 border-b">{user._id}</td>
                      <td className="py-2 px-4 border-b">{user.username}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.address}</td>
                      <td className="py-2 px-4 border-b">{user.phone}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleUserDelete(user._id)}
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
              {allUsers.map((user) => (
                <div key={user._id} className="mb-4 border rounded-lg p-4">
                  <div className="mb-2 text-sm">
                    <strong>ID:</strong> {user._id}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Username:</strong> {user.username}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Address:</strong> {user.address}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>Phone:</strong> {user.phone}
                  </div>
                  <button
                    onClick={() => handleUserDelete(user._id)}
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
        {!loading && allUsers.length === 0 && (
          <p className="text-center">No users found.</p>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AllUsers;