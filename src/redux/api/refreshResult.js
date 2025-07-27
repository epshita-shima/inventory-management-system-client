import { api } from "./apiSlice";
import { authActions } from "./authSlice";
import { scheduleTokenRefresh } from "./scheduleTokenRefresh";

export const refreshToken = () => async (dispatch, getState) => {
  try {
    const refreshResult = await dispatch(
      api.endpoints.refreshToken.initiate()
    );

    if (refreshResult?.data?.success === true) {
      const newToken = refreshResult.data.accessToken;
      dispatch(authActions.setToken(newToken));
      localStorage.setItem("accesstoken", newToken);
      scheduleTokenRefresh(newToken, dispatch);
    } else {
      dispatch(authActions.logout());
      localStorage.clear();
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    dispatch(authActions.logout());
    localStorage.clear();
    window.location.href = "/";
  }
};
