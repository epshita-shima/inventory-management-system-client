import React, { useEffect, useRef, useState } from 'react';
import { createPopper } from '@popperjs/core';

const NavbarItem = ({ item,index }) => {
const [isOpen, setIsOpen] = useState(false);

const handleToggle = () => {
  setIsOpen(!isOpen);
};

return (
  <li className="dropdown-submenu">
    <a
      className={`dropdown-item ${item?.dropdown ? 'dropdown-toggle' : ''}`}
      href={item?.link}
      onClick={item?.dropdown ? handleToggle : null}
    >
      {item?.label}
    </a>
    {item?.dropdown && (
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
        {item?.dropdown.map((subItem, index) => (
          <NavbarItem key={index} item={subItem} />
        ))}
      </ul>
    )}
  </li>
);

};


export default NavbarItem