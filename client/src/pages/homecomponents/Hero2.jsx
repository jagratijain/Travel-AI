import React from "react";
import { Link } from "react-router-dom";

const Hero2 = () => {
  return (
    <>
      <div className="md:px-36 px-8 md:py-28 py-5">
        <div className="flex lg:flex-row flex-col grid-cols-2 gap-10">
          <div className="flex flex-col gap-5 justify-center p-5">
            <h1 className="text-4xl md:text-5xl font-bold">Revolutionize</h1>
            <h1 className="text-4xl md:text-5xl font-bold">your Travel with</h1>
            <h1 className="text-4xl md:text-6xl font-bold text-[#41A4FF]">
            AI Voyages
            </h1>
            <p className="mt-4">
            Embark on intelligent adventures with AI-enhanced travel, personalizing your journey every step of the way.
            </p>
            <div className="mt-8">
            <Link to="/packages" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-500 px-8 py-3 text-white font-bold transition duration-300 ease-out hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Get Started</span>
              <span className="relative invisible">Get Started</span>
            </Link>
          </div>
          </div>
          <div className="">
            <img
              src="images/main.jpg"
              alt="heroimg"
              className="rounded-3xl h-[100%] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero2;