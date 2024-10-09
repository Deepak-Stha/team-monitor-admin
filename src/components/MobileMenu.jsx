import React, { useState } from 'react';

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button className="mobilemenu" onClick={toggleMobileMenu}>
        Open Mobile Menu
      </button>
      <div className="mobilebox" style={{ display: isMenuOpen ? 'block' : 'none' }}>
        {/* Content of mobile menu */}
        <button className="cross_icon" onClick={toggleMobileMenu}>
          Close Mobile Menu
        </button>
      </div>
    </>
  );
};

export default MobileMenu;
