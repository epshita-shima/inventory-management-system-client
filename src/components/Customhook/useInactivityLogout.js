import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../redux/api/apiSlice";
import swal from "sweetalert";
import { useUserLoggedOutMutation } from "../../redux/features/auth/authApi";
import { authActions } from "../../redux/api/authSlice";

const useInactivityLogout = () => {
  const [loggedoutUser] = useUserLoggedOutMutation();
  const dispatch = useDispatch();
  let inactivityTimer;
  const resetTimer = () => {
   if(window.location.pathname !== "/"){
    clearTimeout(inactivityTimer);
    localStorage.setItem('lastActivityTime',Date.now())
    inactivityTimer = setTimeout(() => {
      swal("Session Expired!", "Plase Login again", "warning");
      handleLogout();
    }, 10 * 60 * 1000);
   }
  };

  const handleLogout = async () => {
    if(window.location.pathname !== "/"){
      dispatch(api.util.resetApiState());
      const response = await loggedoutUser();
      if (response.data.success === true) {
        dispatch(authActions.logout());
        localStorage.clear();
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    // Attach event listeners
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;

    const syncActivity=()=>{
      const lastActivityTime=localStorage.getItem('lastActivityTime')

      console.log('lastActivityTime && Date.now() - lastActivityTime',lastActivityTime && Date.now() - lastActivityTime)
      if(lastActivityTime && Date.now() - lastActivityTime < 10*60*1000){
        resetTimer()
      }
    }
    window.addEventListener("storage", syncActivity);
    // Cleanup event listeners on unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.onload = null;
      document.onmousemove = null;
      document.onkeypress = null;
      document.onclick = null;
      window.removeEventListener("storage",syncActivity)
    };
  }, []);
};

export default useInactivityLogout;
