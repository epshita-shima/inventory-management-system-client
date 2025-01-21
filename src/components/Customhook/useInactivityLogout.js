import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../redux/api/apiSlice";
import { logout } from "../../redux/api/authSlice";
import swal from "sweetalert";
import { useUserLoggedOutMutation } from "../../redux/features/auth/authApi";

const useInactivityLogout = () => {
  const [loggedoutUser] = useUserLoggedOutMutation();
  const dispatch = useDispatch();
  let inactivityTimer;
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      swal("Session Expired!", "Plase Login again", "warning");
      handleLogout();
    }, 10 * 60 * 1000);
  };

  const handleLogout = async () => {
    dispatch(api.util.resetApiState());
    const response = await loggedoutUser();
    if (response.data.success === true) {
      dispatch(logout());
      localStorage.clear();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    // Attach event listeners
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;

    // Cleanup event listeners on unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.onload = null;
      document.onmousemove = null;
      document.onkeypress = null;
      document.onclick = null;
    };
  }, []);
};

export default useInactivityLogout;
