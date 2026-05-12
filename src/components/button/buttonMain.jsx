// Reusable Button Component
import arrow from '../../assets/home/arrow.svg'; // Importing arrow icon

const Button = ({ text, onClick, className, showArrow = true }) => {
  return (
    // Button container with applied styles
    <div
      className={`flex items-center px-10 py-4 w-fit bg-[#968048] text-white cursor-pointer 
                  font-semibold text-xs md:text-sm uppercase whitespace-nowrap gap-10
                  transition-all duration-300 ease-in-out 
                  hover:bg-black hover:text-white ${className} font-body`} // Combining dynamic and static class names
      onClick={onClick} // Click event handler
    >
      <div>
        {text} {/* Displaying button text */}
      </div>
      {/* Conditionally render the arrow icon based on the showArrow prop */}
      {/* {showArrow && <img src={arrow} alt="arrow" className="ml-2 hidden md:block" />} Arrow icon */}
    </div>
  );
};

export default Button;
