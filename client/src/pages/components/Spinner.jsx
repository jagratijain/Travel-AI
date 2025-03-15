import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);

    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }

    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {/* <h1 className="text-center text-2xl font-semibold mb-4">
        Redirecting you in {count}
      </h1> */}
      <ClipLoader size={50} color={"#4A90E2"} loading={true} />
    </div>
  );
};

export default Spinner;
