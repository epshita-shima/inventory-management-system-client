import { useRefreshTokenMutation } from "./apiSlice";
import { authActions } from "./authSlice";
import { scheduleTokenRefresh } from "./scheduleTokenRefresh";

export const refreshToken = () => async (dispatch, getState) => {
const [refreshToken]=useRefreshTokenMutation()
  try {
    const refreshResult = await refreshToken();
    if (refreshResult.data.success===true) {
      const data = await refreshResult.json();
      dispatch(authActions.setToken(data.accessToken));
      localStorage.setItem("accesstoken", data.accessToken);
      scheduleTokenRefresh(data.accessToken, dispatch); // Reschedule for the new token
    } else {
      dispatch(authActions.logout());
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    dispatch(authActions.logout());
    localStorage.clear();
    window.location.href = "/";
  }
};
