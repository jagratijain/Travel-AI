import React from "react";
import { MdTour } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { BiMap } from "react-icons/bi";

const categories = [
  {
    name: "Tour Packages",
    icon: <MdTour />,
    description: "Explore curated tour packages for unforgettable experiences.",
  },
  {
    name: "AI-Powered Destination Recommender",
    icon: <BiMap />,
    description: "Receive personalized destination suggestions based on AI insights.",
  },
  {
    name: "AI Assistant for Travel Queries",
    icon: <AiOutlineRobot />,
    description: "Intelligent responses to all your travel-related questions.",
  }
];

const Services = () => {
  return (
    <div className="lg:px-36 lg:py-16 ">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#41A4FF] text-lg font-semibold mb-2 block">
            Our Services
          </span>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            What We Provide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-powered travel planning: streamlined booking and intelligent destination exploration for seamless adventures.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:bg-blue-50">
              <div className="text-[#41A4FF] text-4xl mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {category.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-[#41A4FF] transition-colors duration-300">
                {category.name}
              </h4>
              <p className="text-gray-600 mb-4 transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 overflow-hidden">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;