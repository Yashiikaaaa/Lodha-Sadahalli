import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importing highlight images
import pic1 from '../icons/highlights/pic1.png';
import pic2 from '../icons/highlights/pic2.png';
import pic3 from '../icons/highlights/pic3.png';
import pic4 from '../icons/highlights/pic4.png';

// Arrow components for custom navigation
function NextArrow({ onClick }) {
  return (
    <div onClick={onClick}>
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
        className="slick-arrow slick-next"
        style={{ display: 'block' }}
      >
        <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div onClick={onClick}>
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
        className="slick-arrow slick-prev"
        style={{ display: 'block' }}
      >
        <path d="M21 12L3 12M3 12L11.5 20.5M3 12L11.5 3.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Tabs data for different highlights
const tabs = [
  { id: 1, title: 'EXTERIOR', photos: [pic1, pic2, pic3, pic4] },
];

// Main Highlights component
export const Highlights = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="bg-[#d0eeff] pb-12 px-4 md:px-16 mx-auto" id="Highlights">
      <div className="text-headColor font-heading font-bold uppercase text-3xl md:text-5xl text-themeColor pb-10 w-full">
        Key Highlights
      </div>
      <div className="flex flex-col justify-center w-full mx-auto">
        {tabs.map((tab) => (
          <Slider {...settings} key={tab.id}>
            {tab.photos.map((photo, index) => (
              <div className="w-full" key={index}>
                <img
                  src={photo}
                  alt={`Highlight ${index + 1}`}
                  className="px-5 py-5 w-auto h-auto flex justify-center items-center mx-auto"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          </Slider>
        ))}
      </div>
    </div>
  );
};
