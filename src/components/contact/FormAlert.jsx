import React, { useState, useEffect } from 'react';
import { Check, Upload, WarningTriangle, Xmark } from 'iconoir-react';

export const FormAlert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.custom-alert')) {
        setIsVisible(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  const getIcon = () => {
    switch (message) {
      case 'Not Submitted':
        return <Xmark />;
      case 'We have successfully received your information. Expect to hear from us shortly!':
        return <Check />;
      case 'Invalid Full Name. Please use only alphabets and spaces.':
        return <WarningTriangle />;
      case 'Invalid Contact Number. Please enter a 10-digit number.':
        return <WarningTriangle />;
      case 'Fill in the contact details. We will share brochure with you':
        return <WarningTriangle />;
      case 'Please fill in all required fields.':
        return <WarningTriangle />;
      default:
        return <Upload />;
    }
  };

  return (
    <>
      {isVisible && (
        <div className="fixed top-32 right-0 left-0 mx-auto w-fit p-5 shadow-lg bg-gray-200 custom-alert">
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center space-x-2">
              <div className='rounded-full bg-black text-white p-2 flex items-center justify-center'>{getIcon()}</div>
              <p className="text-black">{message}</p>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
            >
              <Xmark />
            </button>
          </div>
        </div>
      )}
    </>
  );
};