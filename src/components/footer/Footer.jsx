import React from 'react';
import Button from '../button/buttonMain';  // Reusable button component
import contactbanner from '../../assets/footer/footer.webp';
import { useLeadTracking, LEAD_SOURCES } from '../../hooks/useLeadTracking';

// Footer Component
export const Footer = ({ openContactModal }) => {
  const { trackButtonClick } = useLeadTracking();
  
  // Styles for the background image
  const opacBackground = {
    backgroundImage: `url(${contactbanner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Overlay style to darken the background for better readability
  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  };

  return (
    <div className="relative">
      
      {/* Contact Section */}
      <div className="text-white border-t border-gray-700 h-auto" style={opacBackground}>
        <div style={overlayStyle} className="mx-auto">

          {/* Call to Action Section */}
          <div className="flex flex-col text-center gap-6 md:gap-10 items-center justify-center mx-auto pt-32 pb-16 md:pt-36 md:pb-24 lg:h-[60vh] w-full">
            
            {/* Section Heading */}
            <div className="text-lg md:text-4xl max-w-3xl font-semibold font-heading leading-tight md:leading-normal uppercase">
              Looking To Get In Touch With Us?
            </div>
            
            {/* Button to trigger Contact Modal */}
            <div className="">
              <Button 
                text="Fill the form" 
                className="text-center my-2 md:my-6 h-fit md:py-4 md:px-16 py-3 px-8 w-fit scroll-to-top" 
                onClick={() =>{ 
                  trackButtonClick(LEAD_SOURCES.FOOTER, 'fill_form', 'Footer Section CTA');
                  openContactModal(LEAD_SOURCES.FOOTER);
                }} 
                showArrow={false}
              />
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="mx-auto w-full">
        <footer className="bg-black text-white p-5 w-full">
          <div className="max-w-8xl text-xs sm:text-lg flex flex-col lg:flex-row gap-5 justify-between w-full mx-auto font-semibold text-center">
            
            {/* Privacy Policy Link */}
            <p>
              <button className="underline">Privacy Policy</button>
            </p>
            
            {/* Disclaimer Section */}
            <p>
              <span className="pr-2 font-bold">Disclaimer:</span>
              This website is not an official site; it belongs to the authorized channel partner and is for informational purposes only.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;