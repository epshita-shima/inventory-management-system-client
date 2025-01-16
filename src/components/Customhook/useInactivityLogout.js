import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../../redux/api/apiSlice';
import { logout } from '../../redux/api/authSlice';
import swal from "sweetalert";

const useInactivityLogout = () => {
  const dispatch=useDispatch()
  let inactivityTimer;
  const resetTimer=()=>{
    clearTimeout(inactivityTimer)
    inactivityTimer=setTimeout(()=>{
      swal(
        "Session Expired!",
        "Plase Login again",
        "warning"
      );
      handleLogout()
    },1*60*1000)
  }

  const handleLogout =()=>{
    dispatch(api.util.resetApiState());
    dispatch(logout());
    localStorage.clear('user'); 
    clearAuthCookie()
    window.location.href = '/';
  }
  const clearAuthCookie = () => {
    console.log(document.cookie)
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
}

export default useInactivityLogout
