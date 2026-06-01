import { useEffect, useState, useMemo } from "react";
import { FormAlert } from "./FormAlert";
import ReactGA from "react-ga4";
import { Phone, Xmark } from "iconoir-react";
import overlaybg from "../../assets/gallery/14.webp";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useLeadTracking, LEAD_SOURCES } from "../../hooks/useLeadTracking";

// Import environment variables
const trackingId = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (trackingId) {
  ReactGA.initialize(trackingId);
}

const ContactForm = ({ contactmodal, setContactModal, leadSource }) => {
  const { trackFormSubmission } = useLeadTracking();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [utmParams, setUtmParams] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Validate form
  const isFormValid = useMemo(() => {
    if (!name || !number) return false;

    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(name)) return false;

    if (!isValidPhoneNumber(number)) return false;

    return true;
  }, [name, number]);

  // Mobile check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Get UTM params
  function getUTMParams() {
    if (typeof window === "undefined") return {};

    const params = new URLSearchParams(window.location.search);

    return {
      utmSource: params.get("utmSource") || "",
      utmMedium: params.get("utmMedium") || "",
      utmCampaign: params.get("utmCampaign") || "",
      utmKeyword: params.get("utmKeyword") || "",
      gclid: params.get("gclid") || "",
    };
  }

  useEffect(() => {
    setUtmParams(getUTMParams());
  }, []);

  // Validate form fields
  const validateForm = () => {
    if (!name || !number) {
      setAlert(
        <FormAlert
          message="Please fill in all required fields."
          onClose={() => setAlert(null)}
        />
      );

      return false;
    }

    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(name)) {
      setAlert(
        <FormAlert
          message="Invalid Name. Use only alphabets and spaces."
          onClose={() => setAlert(null)}
        />
      );

      return false;
    }

    if (!isValidPhoneNumber(number)) {
      setAlert(
        <FormAlert
          message="Invalid Phone Number."
          onClose={() => setAlert(null)}
        />
      );

      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Track lead
    trackFormSubmission(
      leadSource?.source || LEAD_SOURCES.UNKNOWN,
      "contact_form",
      leadSource?.propertyType
    );

    setAlert(
      <FormAlert
        message="Submitting form..."
        onClose={() => setAlert(null)}
      />
    );

    // Payload for CRM
    const payload = {
      name: name.trim().toLowerCase(),
      phoneNumber: number.trim(),

      campaign: true,
      projectId: "",
      projectName: "Lodha Sadahalli",
      currentAgent: "Unknown",

      // Added fields
      property_type: "primary",
      lead_type: "demand",

      utmDetails: {
        source: utmParams.utmSource || null,
        medium: utmParams.utmMedium || null,
        campaign: utmParams.utmCampaign || null,
        keyword: utmParams.utmKeyword || null,
        gclid: utmParams.gclid || null,
      },
    };

    try {
      const response = await fetch(
        "https://google-campaign-leads-service-dot-iqol-crm.uc.r.appspot.com/handleMultipleCampaignData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log("Success:", result);

      // Reset fields
      setName("");
      setNumber("");

      setAlert(
        <FormAlert
          message="We received your info. Expect a response soon!"
          onClose={() => setAlert(null)}
        />
      );
      setTimeout(() => setContactModal(false), 2000);
    } catch (error) {
      console.error("Error submitting form:", error);

      setAlert(
        <FormAlert
          message="Something went wrong. Please try again later."
          onClose={() => setAlert(null)}
        />
      );
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-80 z-30"></div>

      {/* Modal */}
      <div
        className={`fixed ${
          isMobile ? "" : "top-24"
        } left-0 right-0 bg-white z-40 w-full md:w-fit mx-auto`}
      >
        <div
          className="max-w-7xl mx-auto flex gap-5 items-center justify-between border shadow-xl overflow-hidden"
          style={{ height: "75vh" }}
        >
          {/* Left Image */}
          <img
            src={overlaybg}
            alt="background"
            className="hidden md:block w-full h-full"
          />

          {/* Form Section */}
          <div className="mx-auto w-full gap-3 px-8 h-full flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
              className="text-3xl focus:outline-none float-end absolute top-2 right-2 bg-white w-fit"
              onClick={() => setContactModal(!contactmodal)}
            >
              <Xmark />
            </button>

            {/* Heading */}
            <div
              className={`font-subheading font-semibold text-[28px] leading-[25px] text-center ${
                isMobile ? "pt-4" : "pt-36"
              } md:pt-8`}
            >
              Want to know more? Enquire Now!
            </div>

            {/* Name Input */}
            <div className="mx-auto max-w-sm pt-8 w-full">
              <input
                type="text"
                className="p-4 w-full bg-transparent text-base focus:outline-none placeholder-gray-400 text-black border border-gray-500 rounded-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Phone Input */}
            <div className="mx-auto max-w-sm py-4 w-full">
              <PhoneInput
                className="bg-transparent text-base focus:outline-none border border-gray-500 rounded-sm h-16 p-5"
                placeholder="Contact Number"
                defaultCountry="IN"
                value={number}
                onChange={setNumber}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center justify-between w-full">
              {/* Submit Button */}
              <div className="mx-auto max-w-sm w-full">
                <button
                  onClick={handleSubmit}
                  className={`text-white my-5 p-2 w-full ${
                    loading || !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-PrestigeBrown"
                  }`}
                  disabled={loading || !isFormValid}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>

              {/* Divider */}
              <div className="flex w-full items-center justify-center gap-[10px]">
                <div className="h-[2px] w-[86px] bg-[#D9D9D9]" />

                <span className="font-sans font-normal text-[18px] leading-[24px] text-[#7E7E7E]">
                  Or
                </span>

                <div className="h-[2px] w-[86px] bg-[#D9D9D9]" />
              </div>

              {/* Call Button */}
              <div className="mx-auto max-w-sm w-full">
                <button className="text-white my-5 p-2 w-full bg-PrestigeBrown flex items-center justify-center hover:bg-opacity-90 transition">
                  <a href="tel:+919353329893" className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    93533 29893
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert && <div>{alert}</div>}
      </div>
    </div>
  );
};

export default ContactForm;