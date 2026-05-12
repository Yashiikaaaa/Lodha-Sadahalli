import React from 'react';

export const Features = () => {
  // Array containing the features data
  const featuresData = [
    { id: 1, title: 'Project Size', value: '70+ Acres' },
    { id: 2, title: 'Possession', value: 'Dec 2029 ' },
    { id: 3, title: 'Starting Price', value: '₹ 3.5 Cr*' },
    { id: 4, title: 'Units', value: '3, 4 & 5 BHK' },
  ];

  return (
    <section className="w-full bg-PrestigeGrey">
      <div className="bg-[#282625] text-PrestigeGrey w-full transform -translate-y-1/2">
        <div className="flex flex-wrap justify-between items-center text-center mx-auto max-w-8xl py-1">

          {featuresData.map((feature, index) => (
            <React.Fragment key={feature.id}>
              {/* Feature Item */}
              <div className="w-[48%] sm:w-[19%] flex flex-col gap-1 sm:gap-4 ">
                <h1 className="text-xs md:text-lg font-bold font-heading uppercase">
                  {feature.title}
                </h1>
                <h3 className="text-2xl md:text-4xl font-subheading font-normal">
                  {feature.value}
                </h3>
              </div>

              {/* Add divider after each item except the last one and the second item on screens < 680px */}
              {index !== featuresData.length - 1 && !(index === 1 && window.innerWidth < 680) && ( // Hides divider for the second item on screens < 680px
                <div className={`border-r h-16 md:h-36 ${index % 2 === 0 ? 'mt-4 mb-4 md:my-0' : ''} border-white`}></div>
              )}
            </React.Fragment>
          ))}
          
        </div>
      </div>
    </section>
  );
};
