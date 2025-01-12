/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/features/user/userSlice";
import NavbarItem from "../../components/NavbarItem";
import Dropdown from "../../components/DynamicDropdown";
import { Menubar } from 'primereact/menubar';
const Navbar = ({ data }) => {
  const [menuItems, setMenuItems] = useState(data);

  // Function to update isChecked status of parent based on children's isChecked status
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, []); // Run once on component mount

  return (
    <Menubar model={menuItems} />
  );
};
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth).then(() => {
//         dispatch(setUser(null));
//         navigate("/login");
//       });
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

  // return (
  //   <nav className="navbar navbar-expand-lg navbar-light bg-light">
  //   <div className="collapse navbar-collapse">
  //     <ul className="navbar-nav">
  //       {data?.map((item, index) =>{ 
  //         console.log(item)
  //         return(
  //         <Dropdown key={index} item={item} isRight={index % 2 === 0} index={index}/>
  //       )})}
  //     </ul>

  //   </div>
  //  {/* {user?.email ? (
  //   <div class="d-flex">
  //     <button
  //       class="btn btn-outline-success"
  //       onClick={() => {
  //         handleSignOut();
  //       }}
  //     >
  //       Logout
  //     </button>
  //   </div>
  // ) : (
  //   ""
  // )} */}
  // </nav>
  // );

  
// };
export default Navbar;
