import { useCallback } from "react";
import ReactGA from "react-ga4";

// ----------------------------------
// UTM utility
// ----------------------------------
const getUTMParams = () => {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);

  const getParam = (keys) => {
    for (const key of keys) {
      const val = urlParams.get(key);
      if (val) return val;
    }
    return null;
  };

  return {
    utm_source: getParam(["utm_source", "utmSource"]),
    utm_medium: getParam(["utm_medium", "utmMedium"]),
    utm_campaign: getParam(["utm_campaign", "utmCampaign"]),
    utm_keyword: getParam(["utm_keyword", "utmKeyword"]),
    utm_term: getParam(["utm_term", "utmTerm"]),
    utm_content: getParam(["utm_content", "utmContent"]),
    gclid: getParam(["gclid"]),
  };
};

// ----------------------------------
// String normalizer helper
// ----------------------------------
const normalize = (str) => {
  return (str || "")
    .toLowerCase()
    .replace(/[_\s]+/g, "_")
    .trim();
};

// ----------------------------------
// Unified hook (fires both general + specific events)
// ----------------------------------
export const useLeadTracking = () => {
  const utmParams = getUTMParams();

  // 🔹 General Event
  const trackGeneralEvent = useCallback(
    (action, category, label, extra = {}) => {
      ReactGA.event({
        action,
        category,
        label,
        ...utmParams,
        ...extra,
      });
    },
    [utmParams]
  );

  // 🔹 Specific Event
  const trackSpecificEvent = useCallback(
    (action, category, label, extra = {}) => {
      ReactGA.event({
        action,
        category,
        label,
        ...utmParams,
        ...extra,
      });
    },
    [utmParams]
  );

  // ----------------------------------
  // BUTTON CLICKS
  // ----------------------------------
  const trackButtonClick = useCallback(
    (source, action, propertyType = null) => {
      const normalizedSource = normalize(source);
      const normalizedAction = normalize(action);
      const label = `${source}${propertyType ? ` - ${propertyType}` : ""}`;

      // 1️⃣ General event
      trackGeneralEvent(normalizedAction, "Button Click", label, {
        lead_source: source,
        property_type: propertyType,
        funnel_stage: "interest",
      });

      // 2️⃣ Specific event
      trackSpecificEvent(
        `${normalizedSource}_${normalizedAction}`,
        "Button Click - Specific",
        label,
        {
          lead_source: source,
          property_type: propertyType,
          funnel_stage: "interest",
        }
      );
    },
    [trackGeneralEvent, trackSpecificEvent]
  );

  // ----------------------------------
  // FORM SUBMISSIONS
  // ----------------------------------
  const trackFormSubmission = useCallback(
    (source, formType, propertyType = null) => {
      const normalizedSource = normalize(source);
      const normalizedForm = normalize(formType);
      const label = `${source}${propertyType ? ` - ${propertyType}` : ""}`;

      // 1️⃣ General event
      trackGeneralEvent(`${normalizedForm}_submit`, "Form Submission", label, {
        lead_source: source,
        property_type: propertyType,
        funnel_stage:
          formType === "contact_form" ? "lead" : "site_visit_request",
      });

      // 2️⃣ Specific event
      trackSpecificEvent(
        `${normalizedSource}_${normalizedForm}_submit`,
        "Form Submission - Specific",
        label,
        {
          lead_source: source,
          property_type: propertyType,
          funnel_stage:
            formType === "contact_form" ? "lead" : "site_visit_request",
        }
      );
    },
    [trackGeneralEvent, trackSpecificEvent]
  );

  // ----------------------------------
  // FORM OPENS
  // ----------------------------------
  const trackFormOpen = useCallback(
    (source, formType, propertyType = null) => {
      const normalizedSource = normalize(source);
      const normalizedForm = normalize(formType);
      const label =
        propertyType && !normalizedSource.includes(normalize(propertyType))
          ? `${source} - ${propertyType}`
          : source;

      // 1️⃣ General event
      trackGeneralEvent(`${normalizedForm}_opened`, "Form Interaction", label, {
        lead_source: source,
        property_type: propertyType,
        funnel_stage: "consideration",
      });

      // 2️⃣ Specific event
      trackSpecificEvent(
        `${normalizedSource}_${normalizedForm}_opened`,
        "Form Interaction - Specific",
        label,
        {
          lead_source: source,
          property_type: propertyType,
          funnel_stage: "consideration",
        }
      );
    },
    [trackGeneralEvent, trackSpecificEvent]
  );

  return {
    trackButtonClick,
    trackFormSubmission,
    trackFormOpen,
  };
};

// Lead source constants
export const LEAD_SOURCES = {
  HERO: "hero_banner",
  OVERVIEW: "overview_section",
  PRICING_3BHKregular: "pricing_3BHKregular",
  PRICING_3BHKoptima: "pricing_3BHKoptima",
  PRICING_3halfBHK: "pricing_3halfBHK",

  MASTER_PLAN: "master_plan_section",
  FOOTER: "footer_section",
  CONTACT_FORM_LINK: "contact_form_internal_link",
  UNKNOWN: "unknown_source",
};

// Property types
export const PROPERTY_TYPES = {
  BHK3regular: "3BHKregular",
  BHK3Optima: "3BHKoptima",
  BHK3half: "3BHKhalf",
  
};
