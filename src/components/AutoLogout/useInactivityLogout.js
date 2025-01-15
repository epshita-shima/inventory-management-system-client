import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../../redux/api/apiSlice';
import { logout } from '../../redux/api/authSlice';

const useInactivityLogout = () => {
  const dispatch=useDispatch()
  let inactivityTimer;
  const resetTimer=()=>{
    clearTimeout(inactivityTimer)
    inactivityTimer=setTimeout(()=>{
      alert('You have been logged out due to inactivity.');
      handleLogout()
    },1*60*1000)
  }

  const handleLogout =()=>{
    dispatch(api.util.resetApiState());
    dispatch(logout());
    localStorage.clear('user'); // Clear token
    window.location.href = '/';
  }
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
