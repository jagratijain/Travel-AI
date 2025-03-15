import { Rating } from "@mui/material";
import React from "react";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Link to={`/package/${packageData._id}`} className="w-64 max-w-sm m-4 transform transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        <img
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
          src={packageData.packageImages[0]}
          alt="Package Image"
        />
        <div className="p-4">
          <p className="font-semibold text-lg truncate capitalize">
            {packageData.packageName}
          </p>
          <p className="text-green-700 text-md capitalize">
            {packageData.packageDestination}
          </p>
          {(packageData.packageDays > 0 || packageData.packageNights > 0) && (
            <p className="flex text-md items-center gap-2 text-gray-700">
              <FaClock />
              {packageData.packageDays > 0 &&
                `${packageData.packageDays} ${packageData.packageDays > 1 ? "Days" : "Day"}`}
              {packageData.packageDays > 0 && packageData.packageNights > 0 && " - "}
              {packageData.packageNights > 0 &&
                `${packageData.packageNights} ${packageData.packageNights > 1 ? "Nights" : "Night"}`}
            </p>
          )}
          {/* Price & Rating */}
          <div className="flex justify-between items-center mt-2">
            {packageData.packageTotalRatings > 0 && (
              <p className="flex items-center text-md text-yellow-500">
                <Rating
                  value={packageData.packageRating}
                  size="small"
                  readOnly
                  precision={0.1}
                />
                <span className="ml-1 text-gray-600">({packageData.packageTotalRatings})</span>
              </p>
            )}
            {packageData.offer && packageData.packageDiscountPrice ? (
              <p className="flex gap-1 items-center">
                <span className="line-through text-gray-500">
                  ${packageData.packagePrice}
                </span>
                <span className="font-medium text-green-700">
                  Rs. {packageData.packageDiscountPrice}
                </span>
              </p>
            ) : (
              <p className="font-medium text-green-700">
                Rs. {packageData.packagePrice}
              </p>
            )}
          </div>
          {/* Price & Rating */}
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
