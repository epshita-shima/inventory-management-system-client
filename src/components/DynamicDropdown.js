import { useRef, useState } from "react";
import NavbarItem from "./NavbarItem";

const Dropdown = ({ item ,isRight,index}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  return (
    <li className={`nav-item dropdown ${isOpen ? 'show' : ''}`}>
      <a
        className="nav-link dropdown-toggle"
        href={item.link}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={handleToggle}
      >
        {item?.label}
      </a>
      {item?.dropdown && (
        <ul className={`dropdown-menu ${isOpen ? 'show' : ''} `}>
          {item?.dropdown?.map((subItem, index) => (
            <Dropdown key={index} item={subItem} isRight={!isRight} index={index} />
          ))}
        </ul>
      )}
    </li>
  );

}


export default Dropdown