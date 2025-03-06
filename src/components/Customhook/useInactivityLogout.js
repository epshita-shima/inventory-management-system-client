import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../redux/api/apiSlice";
import swal from "sweetalert";
import { useUserLoggedOutMutation } from "../../redux/features/auth/authApi";
import { authActions } from "../../redux/api/authSlice";

// const useInactivityLogout = () => {
//   const [loggedoutUser] = useUserLoggedOutMutation();
//   const dispatch = useDispatch();
//   let inactivityTimer;
  
//   const resetTimer = () => {
//     if (window.location.pathname !== "/") {
//       clearTimeout(inactivityTimer);
//       localStorage.setItem("isActiveTab", "true");
  
//       inactivityTimer = setTimeout(() => {
//         let countdown = 60;
  
//         // ✅ Broadcast session warning across all tabs
//         localStorage.setItem("sessionWarning", Date.now());
  
//         swal({
//           title: "Session Expiring!",
//           text: `You will be logged out in ${countdown} seconds.`,
//           icon: "warning",
//           buttons: {
//             stay: {
//               text: "Yes, Keep me signed in",
//               value: "stay",
//               className: "btn btn-primary",
//             },
//             logout: {
//               text: "No, Sign me out",
//               value: "logout",
//               className: "btn btn-danger",
//             },
//           },
//           dangerMode: true,
//           closeOnClickOutside: false,
//         }).then((value) => {
//           clearInterval(interval);
  
//           if (value === "logout") {
//             swal("Logged Out!", "You have been logged out successfully.", "success").then(() => {
//               handleLogout();
//             });
//           } else {
//             // ✅ Reset session timer across all tabs
//             localStorage.setItem("resetSession", Date.now());
//             resetTimer();
//           }
//         });
  
//         // ✅ Start countdown after modal appears
//         const interval = setInterval(() => {
//           countdown--;
//           const swalText = document.querySelector(".swal-text");
//           if (swalText) {
//             swalText.innerText = `You will be logged out in ${countdown} seconds.`;
//           }
//           if (countdown <= 0) {
//             clearInterval(interval);
//             swal.close();
//             handleLogout();
//           }
//         }, 1000);
//       }, 10 * 60 * 1000); // Show modal after 1 min of inactivity
//     }
//   };

//   const syncAcrossTabs = (event) => {
//     if (event.key === "sessionWarning") {
//       resetTimer(); // Show warning in all tabs
//     } else if (event.key === "resetSession") {
//       clearTimeout(inactivityTimer);
//       resetTimer(); // Reset session in all tabs
//     }
//   };

//   const handleLogout = async () => {
//     if (window.location.pathname !== "/") {
//       dispatch(api.util.resetApiState());
//       const response = await loggedoutUser();
//       if (response?.data?.success === true) {
//         dispatch(authActions.logout());
//         localStorage.clear();
//         window.location.href = "/";
//       }
//     }
//   };

//   useEffect(() => {
//     // Attach event listeners
//     window.onload = resetTimer;
//     document.onmousemove = resetTimer;
//     document.onkeypress = resetTimer;
//     document.onclick = resetTimer;
//     window.addEventListener("storage", syncAcrossTabs);
//     const syncActivity = () => {
//       const isActive = localStorage.getItem("isActiveTab");
//       if (isActive) {
//         resetTimer();
//       }
//     };
//     window.addEventListener("storage", syncActivity);
//     // Cleanup event listeners on unmount
//     return () => {
//       const accessToken = localStorage.getItem("accesstoken");
//       if (!accessToken) {
//         handleLogout();
//         clearTimeout(inactivityTimer);
//       }
//       clearTimeout(inactivityTimer);
//       window.onload = null;
//       document.onmousemove = null;
//       document.onkeypress = null;
//       document.onclick = null;
//       window.removeEventListener("storage", syncActivity);
//     };
//   }, []);

// };

// export default useInactivityLogout;



const useInactivityLogout = () => {
  const [loggedOutUser] = useUserLoggedOutMutation();
  const dispatch = useDispatch();
  const inactivityTimer = useRef(null);

  const handleLogout = async () => {
    if (window.location.pathname !== "/") {
      dispatch(api.util.resetApiState());
      const response = await loggedOutUser();
      if (response?.data?.success) {
        dispatch(authActions.logout());
        localStorage.clear();
        window.location.href = "/";
      }
    }
  };

  const resetTimer = () => {
    if (window.location.pathname !== "/") {
      clearTimeout(inactivityTimer.current);
      localStorage.setItem("isActiveTab", "true");

      inactivityTimer.current = setTimeout(() => {
        let countdown = 60;

        // Broadcast session warning
        localStorage.setItem("sessionWarning", Date.now());

        swal({
          title: "Session Expiring!",
          text: `You will be logged out in ${countdown} seconds.`,
          icon: "warning",
          buttons: {
            stay: {
              text: "Yes, Keep me signed in",
              value: "stay",
              className: "btn btn-primary",
            },
            logout: {
              text: "No, Sign me out",
              value: "logout",
              className: "btn btn-danger",
            },
          },
          dangerMode: true,
          closeOnClickOutside: false,
        }).then((value) => {
          clearInterval(interval);

          if (value === "logout") {
            swal("Logged Out!", "You have been logged out successfully.", "success").then(() => {
              handleLogout();
            });
          } else {
            localStorage.setItem("resetSession", Date.now());
            resetTimer();
          }
        });

        // Countdown Timer
        const interval = setInterval(() => {
          countdown--;
          const swalText = document.querySelector(".swal-text");
          if (swalText) {
            swalText.innerText = `You will be logged out in ${countdown} seconds.`;
          }
          if (countdown <= 0) {
            clearInterval(interval);
            swal.close();
            handleLogout();
          }
        }, 1000);
      }, 10 * 60 * 1000); // 10 min of inactivity
    }
  };

  const syncAcrossTabs = (event) => {
    if (event.key === "sessionWarning") {
      resetTimer(); // Show warning in all tabs
    } else if (event.key === "resetSession") {
      clearTimeout(inactivityTimer.current);
      resetTimer(); // Reset session in all tabs
    }
  };

  useEffect(() => {
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    window.addEventListener("storage", syncAcrossTabs);

    return () => {
      clearTimeout(inactivityTimer.current);
      document.onmousemove = null;
      document.onkeypress = null;
      document.onclick = null;
      window.removeEventListener("storage", syncAcrossTabs);
    };
  }, []);

  return null;
};

export default useInactivityLogout;
