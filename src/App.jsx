import ReactGA from "react-ga4";
import { useEffect } from "react";
import { PageRoute } from "./PageRoute";

const trackingId = import.meta.env.VITE_GA_MEASUREMENT_ID;

function App() {
  useEffect(() => {
    ReactGA.initialize(trackingId);
  }, []);

  return (
    <div className="font-body md:text-xl bg-white">
      <PageRoute />
    </div>
  );
}

export default App;
