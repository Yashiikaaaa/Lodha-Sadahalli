import { useState } from "react";
import { Phone, Xmark, MenuScale } from "iconoir-react"; // Importing icons for phone, close, and menu
 // Importing Prestige Logo
import { Link } from "react-router-dom"; // Importing Link for routing

// Banner component
export const Banner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  return (
    isBannerVisible && (
      <div id="Banner" className="w-full bg-black text-white text-center p-2 flex justify-center items-center relative">
        <span className="text-sm">🎉 Exclusive Pre-launch price and offers <a href="#" className="underline">Get it now →</a></span>
        <button className="absolute right-4 text-white" onClick={() => setIsBannerVisible(false)}>
          <Xmark className="w-5 h-5" />
        </button>
      </div>
    )
  );
};

// Navbar component
export const Navbar = ({ sitevisitmodal, setSiteVisitModal }) => {
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
    <>
      {/* Main navigation element */}
      <nav className="navbar font-body fixed w-full z-20 top-0 start-0 bg-PrestigeGrey shadow md:px-[7.5rem] py-3 md:py-4">
        <div className="max-w-8xl mx-auto px-5 lg:px-0 flex flex-wrap items-center justify-between">
          {/* Logo Section */}
          <a href="/" className="flex items-center px-4 md:p-0 space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-10 md:h-10" alt="Prestige Autumn Leaves" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileNav}
              className="inline-flex items-center w-10 h-10 justify-center text-black hover:bg-skyblue2Color focus:outline-none"
              aria-expanded={isMobileNavOpen ? "true" : "false"}
            >
              <span className="sr-only">{isMobileNavOpen ? "Close main menu" : "Open main menu"}</span>
              {isMobileNavOpen ? <Xmark className="w-8 h-8" /> : <MenuScale className="w-8 h-8" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`items-center md:flex ${isMobileNavOpen ? "flex min-h-screen backdrop-blur-md w-full" : "hidden"}`}
            id="navbar-sticky"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <ul className="flex flex-col p-4 md:p-0 md:flex-row gap-12 w-full justify-between text-PrestigeDarkGrey">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="block border-b md:border-0 hover:border-gray-400 font-bold text-sm uppercase hover:text-PrestigeBrown transition-all duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
