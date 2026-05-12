import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import ReactGA from "react-ga4";

import { Home } from "./sections/Home";
import { Features } from "./sections/Features";
import { Location } from "./sections/Location";
import { Amenities } from "./sections/Amenities";
import { Footer } from "./components/footer/Footer";
import { Navbar } from "./components/navbar/Navbar";
import { Overview } from "./sections/Overview";
import { WhatsApp } from "./components/contact/WhatsApp";
import Pricing from "./sections/Pricing";
import { MasterPlan } from "./sections/MasterPlan";
import { Gallery } from "./sections/Gallery";
import ContactForm from "./components/contact/ContactForm";
import { useLeadTracking } from "./hooks/useLeadTracking";
// Add this import if you have the useLeadTracking hook
// import { useLeadTracking } from "./hooks/useLeadTracking";

const RevealOnScroll = ({ children }) => {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = React.useState(false);

  const props = useSpring({
    opacity: isIntersecting ? 1 : 0,
    transform: isIntersecting ? "translateY(0)" : "translateY(20px)",
    config: { mass: 1, tension: 210, friction: 20 },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <animated.div ref={ref} style={props}>
      {children}
    </animated.div>
  );
};

export const PageRoute = () => {
  const [sitevisitmodal, setSiteVisitModal] = useState(false);
  const [contactmodal, setContactModal] = useState(false);
  const [leadSource, setLeadSource] = useState(null);
  const pageViewSentRef = useRef(false);
  
  // Uncomment this if you have the useLeadTracking hook
  const { trackFormOpen } = useLeadTracking();

  const openContactModal = (source, propertyType = null) => {
    setLeadSource({ source, propertyType });
    setContactModal(true);
    
    // Uncomment this if you have the useLeadTracking hook
    trackFormOpen(source, 'contact_form', propertyType);
  };

  useEffect(() => {
    if (pageViewSentRef.current) return;
    pageViewSentRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const source = params.get("utmSource");
    const medium = params.get("utmMedium");
    const campaign = params.get("utmCampaign");
    const keyword = params.get("utmKeyword");
    const gclid = params.get("gclid");

    ReactGA.send({
      hitType: "pageview",
      utmSource: source,
      utmMedium: medium,
      utmCampaign: campaign,
      utmKeyowrd: keyword,
      gclid: gclid,
    });
  });

  return (
    <BrowserRouter>
      {/* {sitevisitmodal && (
        <SiteVisitForm
          sitevisitmodal={sitevisitmodal}
          setSiteVisitModal={setSiteVisitModal}
        />
      )} */}
      {contactmodal && (
        <ContactForm
          contactmodal={contactmodal}
          setContactModal={setContactModal}
          setSiteVisitModal={setSiteVisitModal}
          leadSource={leadSource}
        />
      )}

      <Navbar
        sitevisitmodal={sitevisitmodal}
        setSiteVisitModal={setSiteVisitModal}
        openContactModal={openContactModal}
      />

      <WhatsApp />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <RevealOnScroll>
                <Home
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
              <RevealOnScroll>
                <Features />
              </RevealOnScroll>
              {/* <RevealOnScroll>
                { <Highlights /> }
              </RevealOnScroll> */}
              <RevealOnScroll>
                <Overview
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
              <RevealOnScroll>
                <Pricing
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
              <RevealOnScroll>
                <MasterPlan
                  openContactModal={openContactModal}
                />
                <RevealOnScroll>
                  <Location />
                </RevealOnScroll>
              </RevealOnScroll>
              <RevealOnScroll>
                <Amenities />
              </RevealOnScroll>
              <RevealOnScroll>
                <Gallery />
              </RevealOnScroll>
            </>
          }
        />
        <Route
          path="/Home"
          element={
            <>
              <RevealOnScroll>
                <Home
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
            </>
          }
        />
        <Route
          path="/Features"
          element={
            <>
              <RevealOnScroll>
                <Features />
              </RevealOnScroll>
            </>
          }
        />
        {/* <Route path="/Highlights" element={
          <>
            <RevealOnScroll>
              <Highlights />
            </RevealOnScroll>
          </>
        } /> */}
        <Route
          path="/Overview"
          element={
            <>
              <RevealOnScroll>
                <Overview
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
            </>
          }
        />
        <Route
          path="/Pricing"
          element={
            <>
              <RevealOnScroll>
                <Pricing
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
            </>
          }
        />
        <Route
          path="/MasterPlan"
          element={
            <>
              <RevealOnScroll>
                <MasterPlan
                  openContactModal={openContactModal}
                />
              </RevealOnScroll>
            </>
          }
        />
        <Route
          path="/Location"
          element={
            <>
              <RevealOnScroll>
                <Location />
              </RevealOnScroll>
            </>
          }
        />

        <Route
          path="/Amenities"
          element={
            <>
              <RevealOnScroll>
                <Amenities />
              </RevealOnScroll>
            </>
          }
        />
        <Route
          path="/Gallery"
          element={
            <>
              <RevealOnScroll>
                <Gallery />
              </RevealOnScroll>
            </>
          }
        />
      </Routes>
      <Footer openContactModal={openContactModal} />
    </BrowserRouter>
  );
};