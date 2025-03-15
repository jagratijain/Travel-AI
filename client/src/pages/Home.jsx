import React from "react";

import Aboutus from "./homecomponents/Aboutus";
import Hero2 from "./homecomponents/Hero2";
import Services from "./homecomponents/Services";
import Hero3 from "./homecomponents/Hero3";
import Footer from "./homecomponents/Footer";
import ScrollDialog from "./components/Recommender";


const Home = () => {
  

  return (
    <div>
      <Hero2 />
      <Aboutus />
      <Services />
      <Hero3 />
      {/* <Footer /> */}
      <div className="fixed bottom-4 right-4 z-50">
        < ScrollDialog/>
      
      </div>
    </div>
  );
};

export default Home;