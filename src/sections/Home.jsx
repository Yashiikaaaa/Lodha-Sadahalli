import herobanner from "../assets/meta/Screenshot 2026-05-15 184443.png"; // Importing hero banner background image
import Button from "../components/button/buttonMain"; // Importing the Button component for reusability
import homeLocation from "../assets/home/location.svg"; // Importing location icon
import { useEffect, useState } from "react";
// eslint-disable-next-line react/prop-types
import { useLeadTracking, LEAD_SOURCES } from '../hooks/useLeadTracking';


const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

export const Home = ({ openContactModal }) => {
  const isMobile = useIsMobile();
  const { trackButtonClick } = useLeadTracking();
  
  // Dynamic container styles
  const containerStyle = {
    backgroundImage: `url(${herobanner})`,
    backgroundSize: "cover",
    backgroundPosition: isMobile ? "30% center" : "15% 25%",
  };

  const overlayStyle = {
    backgroundImage: isMobile
      ? "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4), rgba(0,0,0,0.5) )"
      : "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
    padding: "2rem",
    height: "100%",
  };

  return (
    // Main container for the Home section
    <div
      id="Home"
      className="w-full h-[30rem] min-h-[98vh] sm:min-h-[85vh] mt-14 md:mt-[4.5rem]"
      style={containerStyle}
    >
      <div className="relative flex flex-col justify-center h-[30rem] min-h-[110vh] sm:min-h-[85vh] w-full items-center gap-8">
        {/* Content Section */}
        {/* Opaque background applied to the whole container including the orange line */}
        <div className="w-full flex items-center" style={overlayStyle}>
          <div className="px-5 lg:px-[7.5rem] md:px-10 flex flex-row justify-center items-center w-full text-white lg:items-start gap-8 pb-[50%] sm:pb-0">
            {/* Vertical line inside the opaque container */}
            <div
              className="hidden md:block md:h-60 md:w-1 md:bg-white"
              style={{
                borderTopLeftRadius: "3px",
                borderBottomLeftRadius: "3px",
              }}
            ></div>

            <div className="w-full max-w-10xl flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-9">
              <div className="flex gap-4 flex-col w-full">
                {/* Main Title */}
                <h1 className="font-subheading text-3xl md:text-6xl font-semibold uppercase">
                 Lodha Sadahalli
                </h1>

                {/* Subtitle */}
                <p className="font-body text-white md:text-2xl text-sm font-normal lg:w-4/6 mx-auto lg:mx-0">
                Luxury Township near the Airport
                  
                </p>
              </div>

              <div className="block sm:hidden">
                <div className="flex gap-2 md:gap-3 rounded-none md:rounded-none items-center text-center md:px-10 px-4">
                  <div className="rounded-full bg-white p-1">
                    <img
                      src={homeLocation} // Location icon
                      alt="Location"
                      className="h-3 md:h-6 text-white"
                    />
                  </div>
                  <p className="max-w-96 font-body font-semibold text-left text-white md:text-2xl text-sm">
                  North Bangalore{/* Location name */}
                  </p>
                </div>
              </div>

              {/* Enquire Now Button using the reusable Button component */}
              <Button
                text="Enquire Now!"
                onClick={() => {
                  trackButtonClick(LEAD_SOURCES.HERO, 'enquire_now', 'Hero Banner CTA');
                  openContactModal(LEAD_SOURCES.HERO);
                }} // Toggle contact modal on button click
              />
            </div>
          </div>
        </div>

        {/* Right-side content (Location card) */}
        <div className=" hidden absolute sm:block top-[67%] right-0 md:mt-0 z-10">
          <div className="flex gap-2 md:gap-3 bg-totalgrey rounded-none md:rounded-none items-center text-center md:px-10 md:py-6 px-4 py-4">
            <img
              src={homeLocation} // Location icon
              alt="Location"
              className="h-3 md:h-6 text-black"
            />
            <p className="max-w-96 font-body text-left text-black md:text-2xl text-xs font-medium leading-[130%]">
            North Bangalore{/* Location name */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
