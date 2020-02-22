import jwtDecode from "jwt-decode";

// check if there is a valid saved token
export function loggedIn() {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}

// check if token is expired
export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

// save user token to local storage
export function setToken(idToken) {
  localStorage.setItem("id_token", idToken);
}

// get token from local storage
export function getToken() {
  return localStorage.getItem("id_token");
}

// clear token from local storage
export function logout() {
  localStorage.removeItem("id_token");
}

// get payload data from token
export function getProfile() {
  return jwtDecode(getToken());
}
