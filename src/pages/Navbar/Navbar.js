/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

import { Menubar } from 'primereact/menubar';
const Navbar = ({ data }) => {
  const [menuItems, setMenuItems] = useState(data);

  const updateParentCheckedStatus = (items) => {
    let allChecked = true;
    for (const item of items) {
      if (item.items && item.items.length > 0) {
        const childrenChecked = updateParentCheckedStatus(item.items);
        item.isChecked = childrenChecked;
      }
      if (!item.isChecked) {
        allChecked = false;
      }
    }
    return allChecked;
  };

  useEffect(() => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems.forEach(item => {
      item.isChecked = updateParentCheckedStatus(item.items);
    });
  
    setMenuItems(updatedMenuItems);
  }, []); 

  return (
    <Menubar model={menuItems} />
  );
};

export default Navbar;
