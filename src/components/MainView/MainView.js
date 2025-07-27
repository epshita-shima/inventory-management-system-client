import React from "react";
import { Outlet } from "react-router-dom";
import Home from "../../pages/Home/Home";
import Footer from "../../pages/Footer/Footer";
import "./MainView.css";
const MainView = ({
  singleUserData,
  setSingleUserData,
  setChangePassword,
  setResetPassword,
}) => {
  const extraSmallScreenHeight = "50vh";
  const smallToMediumScreenHeight = "80vh";
  return (
    <div>
      <div
        style={{
          "@media (maxWidth: 575.98px)": { height: extraSmallScreenHeight },
          "@media (minWidth: 576px) and (maxWidth: 768px)": {
            height: smallToMediumScreenHeight,
          },
        }}
      >
        <Home
          singleUserData={singleUserData}
          setSingleUserData={setSingleUserData}
          setChangePassword={setChangePassword}
          setResetPassword={setResetPassword}
        ></Home>
        <div style={{ paddingTop: "20px", width: "100%" }}>
          <Outlet></Outlet>
        </div>
        <Footer />
      </div>
    </div>
    // <div className="main-layout-wrapper">
    //   <div className="main-layout-content">
    //     <Home
    //       singleUserData={singleUserData}
    //       setSingleUserData={setSingleUserData}
    //       setChangePassword={setChangePassword}
    //       setResetPassword={setResetPassword}
    //     ></Home>

    //     <Outlet></Outlet>
    //   </div>
    //   <Footer />
    // </div>
  );
};

export default MainView;
