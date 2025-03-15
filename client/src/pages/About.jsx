import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="flex justify-center w-full bg-gray-100 py-10">
      <div className="flex flex-col gap-4 bg-white rounded-lg shadow-xl max-w-2xl p-6 w-full md:w-3/4 lg:w-1/2">
        <h1 className="text-3xl font-semibold text-center text-gray-800">About</h1>
        <div className="flex justify-center">
          
        </div>
        
        <ul className="list-disc space-y-2 pl-5 text-gray-600">
          <li>
            <a
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <FaExternalLinkAlt />
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-2 text-pink-600 hover:text-pink-800 hover:underline"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <FaExternalLinkAlt />
            </a>
          </li>
        </ul>
        <p className="text-gray-700 text-justify">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem
          aliquam voluptatibus odit, saepe exercitationem autem molestias
          asperiores dolores sit corrupti molestiae ea, facere, totum
          necessitatibus enim quod aliquid. Quisquam, dolor.
        </p>
      </div>
    </div>
  );
};

export default About;
