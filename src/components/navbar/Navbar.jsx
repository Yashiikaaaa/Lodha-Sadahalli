import { useEffect, useState } from "react";
import { Phone, Xmark, MenuScale } from "iconoir-react"; // Importing icons for phone, close, and menu
import logo from "../../assets/navbar/LodhaLogo.png"; // Importing Prestige Logo
import { Link } from "react-router-dom"; // Importing Link for routing
 import arrow from "../../assets/navbar/whitearrow.png";

// Banner component
export const Banner = ({ setContactModal }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this width as per your definition of "mobile"
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // return (
  //   (isBannerVisible) && (
  //     <div className="w-screen bg-black text-white text-center p-[10px] flex justify-center items-center gap-[16px] max-h-[40px] z-30">
  //       <span className={`font-sans font-semibold ${isMobile ? "text-[14px] leading-[14px]" : "text-[18px] leading-[17.63px]"}`}>
  //         Exclusive prices for the first 100 customers{" "}
  //       </span>
  //       <div className="flex items-center justify-center gap-[4px] cursor-pointer" onClick={() => setContactModal(true)}>
  //         <span className={`font-sans font-semibold ${isMobile ? "text-[14px] leading-[14px]" : "text-[18px] leading-[17.63px]"} hover:underline hover:decoration-white`}>Get it now</span>
  //         <img src={arrow} alt=""  className="w-5 h-4"/>
  //       </div>
  //       <button
  //         className={`absolute ${isMobile ? "right-2 hidden" : "right-4"} text-white`}
  //         onClick={() => setIsBannerVisible(false)}
  //       >
  //         <Xmark className="w-5 " />
  //       </button>
  //     </div>
  //   )
  // );
};

// Navbar component
export const Navbar = ({ sitevisitmodal, setSiteVisitModal, setContactModal }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Function to toggle mobile navigation open/close state
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  // Navigation links data, can be easily modified to add/remove links
  const navLinks = [
    { name: "Home", href: "#Home" },
    { name: "Overview", href: "#Overview" },
    { name: "Pricing", href: "#Pricing" },
    { name: "Master Plan", href: "#MasterPlan" },
    { name: "Location", href: "#Location" },
    { name: "Amenities", href: "#Amenities" },
    { name: "Gallery", href: "#Gallery" },
  ];

  return (
      <div className="font-body fixed w-full z-20 top-0 start-0 bg-white ">
        <Banner setContactModal={setContactModal} />
        <div className="max-w-7xl mx-auto px-5 lg:px-0 flex flex-wrap items-center justify-between py-[8px] z-40 ">
          {/* Logo Section */}
          <a
            href="/"
            className="flex items-center px-4 md:p-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src={logo}
              className="h-20 md:h-20"
              alt="Sattva Hamlet"
            />
          </a>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileNav}
              className="inline-flex items-center w-10 h-10 justify-center text-black hover:bg-skyblue2Color focus:outline-none"
              aria-expanded={isMobileNavOpen ? "true" : "false"}
            >
              <span className="sr-only">
                {isMobileNavOpen ? "Close main menu" : "Open main menu"}
              </span>
              {isMobileNavOpen ? (
                <Xmark className="w-8 h-8" />
              ) : (
                <MenuScale className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`items-center md:flex ${
              isMobileNavOpen
                ? " min-h-screen backdrop-blur-md w-full mt-8"
                : "hidden"
            }`}
            id="navbar-sticky"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <ul className="flex flex-col p-4 md:p-0 md:flex-row gap-12 w-full justify-between text-white">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="block border-b md:border-0 hover:border-gray-400 font-bold text-sm uppercase text-black hover:text-PrestigeBrown transition-all duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Call Button */}
          <div className="hidden lg:flex items-center">
            <a
              href="tel:+919353329893"
              className="flex items-center bg-[#968048] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-opacity-90 transition"
            >
              <Phone className="w-5 h-5 mr-2" />93533 29893
            </a>
          </div>
        </div>
      </div>
  );
};
