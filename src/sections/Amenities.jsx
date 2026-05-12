import React from 'react';

// Importing background image and amenity icons
import Backgrou from '../assets/gallery/12.webp';

import meditate from '../assets/amenities/yoga.png';
import pool from '../assets/amenities/swimming.png';
import gym from '../assets/amenities/gym.png';
import aerobics from '../assets/amenities/aerobics.png';
import tableTennis from '../assets/amenities/table.png';
import poolTable from '../assets/amenities/billiards.png';
import senior from '../assets/amenities/senior.png';
import clubhouse from '../assets/amenities/club.png';
import kids from '../assets/amenities/kids.png';
import squash from '../assets/amenities/squash.png';
import cowork from '../assets/amenities/cowork.png';
import badminton from '../assets/amenities/badminton.png';
import cricket from '../assets/amenities/cricket.jpg';
// Data structure for storing the amenity names and their respective icons
const amenitiesData = {
  
  "Swimming pool": pool,
  "Gymnasium": gym,
 
  "Table Tennis": tableTennis,
  "Pool Table": poolTable,
  "Senior's Corner": senior,
  "Clubhouse": clubhouse,
  "Kid’s play area": kids,
 

  "Badminton Court": badminton
};

// Main Component for displaying the Amenities Section
export const Amenities = () => {
  // Styles for the background container
  const containerStyle = {
    backgroundImage: `url(${Backgrou})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // Overlay style to darken the background for better readability
  const opacBackground = {
    backgroundColor: '#0000008C',   
  };

  return (
    <div id="Home" className="w-full h-auto object-cover" style={containerStyle}>
      {/* Overlay to apply opacity on background */}
      <div className="flex flex-col justify-center w-full " style={opacBackground}>
        <div id="Amenities" className='  max-w-full py-14 px-6 md:px-[7.5rem] flex justify-center'>
          
          {/* Section Header */}
          <div className="w-full mx-auto flex flex-col gap-10">
            <div className='text-center md:text-left text-3xl md:text-5xl font-subheading font-normal w-full text-white px-4 lg:px-2 uppercase'>
              Amenities
            </div> 

            {/* Amenities Grid */}
            {/* <div className=""> */}
              <div className="max-w-full md:max-w-[90%] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-x-12 lg:gap-x-40">
                  
                  {/* Looping through the amenitiesData to dynamically create amenity items */}
                  {Object.entries(amenitiesData).map(([amenity, Icon]) => (
                    <div key={amenity} className="flex flex-col items-center">
                      {/* Amenity Icon */}
                      <img src={Icon} alt={amenity} className="h-12 md:h-20" />
                      
                      {/* Amenity Name */}
                      <span className="py-5 text-white text-center">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            {/* </div> */}

            {/* Commented out older structure (kept for reference) */}
            {/* 
            <div className=" grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-x-12 lg:gap-x-40  py-16 ">
                {Object.entries(amenitiesData).map(([amenity, Icon]) => (
                  <div key={amenity} className="flex flex-col items-center">
                    <img src={Icon} alt={amenity} className='h-12 md:h-20' />
                    <span className='py-5 text-white text-center'>
                        {amenity}
                    </span>
                  </div>
                ))}
            </div>
            */}
          </div>
        </div>
      </div>
    </div>

  );
};
