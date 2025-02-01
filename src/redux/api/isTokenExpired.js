import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log(decoded)
    const currentTime = Math.floor(Date.now() / 1000); 
    const bufferTime = 300;
    return decoded.exp < currentTime + bufferTime // Returns true if expired
  } catch (error) {
    console.error("Invalid token:", error.message);
    return true; // Treat invalid tokens as expired
  }
};

export default isTokenExpired