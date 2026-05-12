import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup } from 'react-leaflet';
import { FilterButton } from './FilterButton';
import './styles.css'

import "leaflet/dist/leaflet.css";


import { Airplane, Bag, Building, Cart, City, DivideThree, HomeAlt, Metro, Train } from 'iconoir-react';

const locationsData = [
    {
        "id": 1,
        "location": "MG Road",
        "distance": 13.2,
        "type": "Commercial Center",
        "coordinates": [12.973633515051148, 77.61612131992482],
    },
    {
        "id": 2,
        "location": "Koramangala",
        "distance": 8,
        "type": "Commercial Center",
        "coordinates": [12.942653794444256, 77.61787802472226],
    },
    {
        "id": 3,
        "location": "HSR Layout",
        "distance": 6,
        "type": "Commercial Center",
        "coordinates": [12.912266104102827, 77.64474975946426],
    },
    {
        "id": 4,
        "location": "Hosa Road Metro Station",
        "distance": 1.6,
        "type": "Train Station",
        "coordinates": [12.871221468936486, 77.65223855392352],
    },
    {
        "id": 5,
        "location": "Infosys E-city",
        "distance": 7.7,
        "type": "Business Park",
        "coordinates": [12.852968588929325, 77.65771003707036],
    },
    {
        "id": 6,
        "location": "IIM Bangalore",
        "distance": 6.6,
        "type": "Tech Park",
        "coordinates": [12.895803435592162, 77.6025148097487],
    },
    {
        "id": 7,
        "location": "Fortis Hospital",
        "distance": 7.2,
        "type": "Hospital",
        "coordinates": [12.895218063426807, 77.59867231890522],
    },

];


const getLocationIcon = (type) => {
    switch (type) {
        case "Metro Station":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><Train width={30} height={30} /></div>) });
        case "Junction":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><DivideThree width={30} height={30} /></div>) });
        case "Train Station":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><Metro width={30} height={30} /></div>) });
        case "Airport":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><Airplane width={30} height={30} /></div>) });
        case "Business Park":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><Bag width={30} height={30} /></div>) });
        case "IT Park":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><City width={30} height={30} /></div>) });
        case "Commercial Center":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><Building width={30} height={30} /></div>) });
        case "Hospital":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><HomeAlt width={30} height={30} /></div>) });
        case "Tech Park":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><City width={30} height={30} /></div>) });
        case "Shopping Mall":
            return L.divIcon({ className: 'dummy', html: ReactDOMServer.renderToString(<div className='flex items-center justify-center text-lg bg-black text-white h-10 w-10 rounded-full border-2 p-2 border-white'><Cart width={30} height={30} /></div>) });
        default:
            return null;
    }
};


export const POIEmbed = () => {
    const position = [12.87727987213904, 77.64136262379219];
    const center = [12.87727987213904, 77.64136262379219];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [interactionMode, setInteractionMode] = useState("auto");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) { // sm and md devices
                setInteractionMode("click");
            } else {
                setInteractionMode("auto");
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filtered locations based on selected category
    const filteredLocations = selectedCategory ? locationsData.filter(location => location.type === selectedCategory) : locationsData;

    // Function to handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };

    // Function to handle selecting all categories
    const handleSelectAll = () => {
        setSelectedCategory(null);
    };

    // Group markers based on location type
    const groupedMarkers = filteredLocations.reduce((groups, location) => {
        const icon = getLocationIcon(location.type);
        const marker = (
            <Marker
                key={location.id}
                position={location.coordinates}
                icon={icon}
                interactive={interactionMode === "auto" || (interactionMode === "click" && selectedCategory === location.type)}
            >
                <Popup>
                    <div className='font-body'>
                        <div className="flex flex-col">
                            <span className="w-fit px-4 py-1 border text-sm rounded-full">{location.type}</span>
                        </div>
                        <div className="text-2xl p-3">{location.location}</div>
                        <div className="flex gap-2 items-center justify-center mt-2">
                            <span>Distance:</span>
                            <span className="text-lg font-bold opacity-75">{location.distance} Km</span>
                        </div>
                    </div>
                </Popup>
            </Marker>
        );

        if (!groups[location.type]) {
            groups[location.type] = [];
        }
        groups[location.type].push(marker);

        return groups;
    }, {});

    return (
        <div>
            {/* Map */}
            <MapContainer style={{ width: "100vw", height: "60vh", zIndex: 1 }} center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://maps.app.goo.gl/RG3nJAg8YydLoRLF9">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>

            {/* Filter buttons */}
            <div className="hidden lg:flex justify-center gap-5 px-5 my-4">
                <button
                    className={`ml-4 w-full h-fit py-5 text-xs rounded-full border border-gray-400 ${selectedCategory === null ? 'bg-black text-white border-none' : 'bg-none'}`}
                    onClick={handleSelectAll}
                >
                    All
                </button>

                {['Metro Station', 'Junction', 'Train Station', 'Airport', 'Business Park', 'IT Park', 'Commercial Center', 'Residential Complex', 'Tech Park', 'Shopping Mall'].map(category => (
                    <button
                        key={category}
                        className={`w-full h-fit py-5 text-xs rounded-full border border-gray-400 ${category === selectedCategory ? 'bg-black text-white border-none' : 'bg-none'}`}
                        onClick={() => handleCategorySelect(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className='lg:hidden p-5'>
                <FilterButton
                    options={['Metro Station', 'Junction', 'Train Station', 'Airport', 'Business Park', 'IT Park', 'Commercial Center', 'Residential Complex', 'Tech Park', 'Shopping Mall']}
                    selectedCategory={selectedCategory}
                    handleCategorySelect={handleCategorySelect}
                />
            </div>
        </div>
    );
};