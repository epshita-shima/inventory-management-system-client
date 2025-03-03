
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from './refreshResult';
export const scheduleTokenRefresh = (accessToken, dispatch) => {
  if (!accessToken) return;

  const decodedToken = jwtDecode(accessToken);
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  const refreshTime = expirationTime - 4 * 60 * 1000; // 4 minutes before expiry
  const currentTime = Date.now();

  if (refreshTime > currentTime) {
    const timeUntilRefresh = refreshTime - currentTime;

    setTimeout(() => {
      dispatch(refreshToken());
    }, timeUntilRefresh);
  }
};