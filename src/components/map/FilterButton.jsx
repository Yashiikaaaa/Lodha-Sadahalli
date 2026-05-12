import { Filter } from 'iconoir-react';
import React, { useState } from 'react';

export const FilterButton = ({ options, selectedCategory, handleCategorySelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="relative">
            <button
                className={`w-full h-fit py-5 text-xs rounded-full border border-gray-400 ${selectedCategory === null ? 'bg-black text-white border-none' : 'bg-none'}`}
                onClick={handleToggleExpand}
            >
                <div className='flex justify-center gap-5 items-center'>

                Filter
                <Filter className='text-black'/>
                </div>
            </button>

            {isExpanded && (
                <div className="absolute top-full bottom-0 right-0 left-0 w-full border border-gray-400 rounded-md mt-2 grid grid-cols-2">
                    <button
                className={`w-full py-5 text-xs rounded-none border-b border-gray-400 ${selectedCategory === null ? 'bg-black text-white border-none' : 'bg-white '}`}
                onClick={() => {
                    handleToggleExpand();
                    handleAllSelect();
                }
                }

            >
                All
            </button>
                    {options.map(category => (
                        <button
                            key={category}
                            className={`w-full py-5 text-xs rounded-none border-b border-gray-400 ${category === selectedCategory ? 'bg-black text-white border-none' : 'bg-white '}`}
                            onClick={() => {
                                handleCategorySelect(category);
                                handleToggleExpand(); // Close the options when a category is selected
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
