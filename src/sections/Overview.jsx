import React from 'react';
import image from '../assets/home/thanku.png';
import Button from '../components/button/buttonMain';
import { useLeadTracking, LEAD_SOURCES } from '../hooks/useLeadTracking';

// Overview Component
export const Overview = ({ openContactModal }) => {
  const { trackButtonClick } = useLeadTracking();
  return (
    <div className="bg-PrestigeGrey">
      <section
        className="w-full flex flex-wrap items-center justify-center gap-[20px] mx-auto pb-10 md:py-16 px-5 md:px-[7.5rem]"
        id="Overview"
      >
        {/* Overview Text Section */}
        <div className="flex flex-col justify-center items-center text-center gap-8 h-full md:items-start md:text-left">
          <h1 className="font-subheading font-normal text-3xl md:text-5xl text-black uppercase">
            Overview
          </h1>
          <p className="max-w-2xl md:text-base text-sm text-black font-body font-light">
          <span className="font-body font-bold text-xs md:text-lg ">
        
Lodha Sadahalli: The Most Awaited Launch in North Bangalore
         </span>
          <br />
          
            <span>
        <br />    <p>  Whether it’s meticulously designed residences or office spaces, our developments seamlessly blend exemplary design, attention to detail, and unparalleled service.

Now, bringing this legacy to Sadahalli, a location emerging as the next growth corridor destination of Bengaluru. 
<p/>
            <br/>
            <p>Lodha Sadahalli is an upcoming pre-launch residential project by the reputed Lodha Group, located in Sadahalli, Devanahalli, North Bangalore. Spread across a vast 70+ acres of land, this premium township is planned to offer thoughtfully designed 3, 4 ,5 BHK apartments with world-class amenities and modern infrastructure. 
              <br />
            </p></p>

            

</span>
          </p>

          {/* Enquire Now Button using the reusable Button component */}
          <Button
                text="Enquire Now!"
                className=""
                onClick={() => {
                  trackButtonClick(LEAD_SOURCES.OVERVIEW, 'enquire_now', 'Overview Section CTA');
                  openContactModal(LEAD_SOURCES.OVERVIEW);
                }}
              />
          
        </div>

        {/* Image and Download Button Section */}
        <div className="hidden md:flex flex-col items-center">
          {/* Image Section */}
          <div className="w-full h-auto flex justify-center border-PrestigeDarkGrey">
            <img
              src={image}
              alt="Prestige Autumn Leaves"
              className=" w-[420px] h-[300px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
