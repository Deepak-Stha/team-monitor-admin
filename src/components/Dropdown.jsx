// import React, { useState } from 'react';

// const Dropdown = ({ options }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState('');

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleOptionSelect = (option) => {
//     setSelectedOption(option);
//     setIsOpen(false);
//   };

//   return (
//     <div className="dropdown">
//       <input
//         className="dropdown-input"
//         type="text"
//         onFocus={toggleDropdown}
//         value={selectedOption}
//         readOnly
//       />
//       <ul className="dropdown-menu" style={{ display: isOpen ? 'block' : 'none' }}>
//         {options.map((option, index) => (
//           <li key={index} onClick={() => handleOptionSelect(option)}>
//             {option}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dropdown;


// Dropdown.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ options, onOptionSelect, placeholder = "Select an option", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    if (onOptionSelect) onOptionSelect(option);
  };

  return (
    <div className={`dropdown ${className}`}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        {selectedOption}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Dropdown;

