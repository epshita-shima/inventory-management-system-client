import React from "react";

const Footer = () => {
  const footerStyle = {
    // backgroundColor: '#CBF3F0',
    backgroundColor: "rgba(21, 253, 4, 0.3)",
    position: "absolute",
    bottom: "0",
    // left: "0", // Added to ensure full width
    width: "100%",
    color: "#23302C",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    height: "50px",
    // zIndex:'-1'
  };

  return (
    <footer className="footer text-center mt-auto py-4" style={footerStyle}>
      <div className="container">
          <div >
            Copyright&copy; 2024{" "}
            <span style={{ 
              textTransform: "capitalize",
              //  color: "#00B987" 
               color: "#2DDC1B" 
               }}>
              Maliha Eco bricks
            </span>
          </div>
       
      </div>
    </footer>
  );
};

export default Footer;
