import React, { useState, useRef, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { createPopper } from '@popperjs/core';

const DynamicNestedDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [placement, setPlacement] = useState('auto');
  const buttonRef = useRef();
  const dropdownRef = useRef();

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const updateDropdownPlacement = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    if (buttonRect.left < dropdownRect.width) {
      setPlacement('right');
    } else {
      setPlacement('left');
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      updateDropdownPlacement();

      const popperInstance = createPopper(buttonRef.current, dropdownRef.current, {
        placement: placement,
      });

      return () => {
        popperInstance.destroy();
      };
    }
  }, [dropdownVisible, placement]);

  return (
    <div>
      <Button ref={buttonRef} onClick={handleDropdownToggle}>
        Toggle Dropdown
      </Button>

      <Dropdown show={dropdownVisible} ref={dropdownRef} placement={placement}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          Custom toggle
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {/* Your nested dropdown content */}
          <Dropdown.Item eventKey="1">Action</Dropdown.Item>
          <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
          <Dropdown.Item eventKey="3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="/"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

export default DynamicNestedDropdown;