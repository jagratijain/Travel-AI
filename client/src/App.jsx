import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/components/Header";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/Routes/AdminRoute";
import UpdatePackage from "./pages/admin/UpdatePackage";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import Search from "./pages/Search";
import AdminPanel from "./pages/admin/AdminPanel";
import Bookings from "./pages/Bookings";
import AdminUpdateProfile from "./pages/admin/AdminUpdateProfile";
import UpdateProfile from "./pages/user/UpdateProfile";
import VerifyUser from "./pages/components/OTP";
import OTPRoute from "./pages/Routes/OTPRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/packages" element={<Search />} />
        <Route path="/verifyuser" element={<VerifyUser />} />

        {/* <Route path="" element={<VerifyUser />} />
        </Route> */}
        {/* user */}
        <Route path="/profile" element={<PrivateRoute />}>
          <Route element={<OTPRoute />}>
            <Route path="user" element={<Profile />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="editprofile" element={<UpdateProfile />} />
          </Route>
        </Route>
        {/* admin */}
        <Route path="/profile" element={<AdminRoute />}>
          <Route element={<OTPRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="editprofile" element={<AdminUpdateProfile />} />
            <Route path="dashboard" element={<AdminPanel />} />
            <Route path="admin/update-package/:id" element={<UpdatePackage />} />
          </Route>
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/package/:id" element={<Package />} />
        <Route path="/package/ratings/:id" element={<RatingsPage />} />
        {/* checking user auth before booking */}
        <Route path="/booking" element={<PrivateRoute />}>
          <Route path=":packageId" element={<Booking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
