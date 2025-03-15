import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";


export default function OTPRoute() {
    
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state.user);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(true);

  // const verifiedCheck = async () => {
  //   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  //   const res = await fetch(`${API_BASE_URL}/api/user/verify-user`, {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  //   if (data.check) setOk(true);
  //   else setOk(false);
  // };

  // useEffect(() => {
  //   if (currentUser !== null)   verifiedCheck()
  // }, [currentUser]);

  // useEffect(() => {
    
  //     if (!currentUser) {
  //       navigate("/login");
  //     } else if (!ok) {
  //       navigate("/verifyuser");
  //     }
    
  // }, [currentUser, ok, navigate]);

  useEffect(() => {
    if (currentUser) {
        if (currentUser.isVerified) {
            setLoading(false);
        } else {
            navigate("/verifyuser");
        }
    } else {
        navigate("/login");
    }
}, [currentUser, navigate]);


  // return currentUser && ok ? <Outlet /> :<Spinner />;
  if (loading) return <Spinner />;
  return currentUser && currentUser.isVerified ? <Outlet /> : null;
}
