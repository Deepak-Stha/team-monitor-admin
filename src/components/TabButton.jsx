import React, { useState } from 'react';

const TabButton = () => {
  const [isRotated, setIsRotated] = useState(false);

  const toggleTab = () => {
    setIsRotated(!isRotated);
  };

  return (
    <button className="tab-btn" style={{ transform: isRotated ? 'rotate(180deg)' : 'none' }} onClick={toggleTab}>
      Toggle Tab
    </button>
  );
};

export default TabButton;
