import jwtDecode from "jwt-decode";
import url from "url";

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

  // remove the JWT
  localStorage.removeItem("id_token");

  // redirect to the CAS logout page
  window.location.href = url.format({
    protocol: "https",
    hostname: "login.oregonstate.edu",
    pathname: "/idp-dev/profile/cas/logout",
  });

}

// get the user associated with the JWT payload, or return an empty object `{}`
// if the user cannot be found or on error
export async function getProfile() {
  try {
    const token = getToken();

    // find the User associated with the payload subject
    const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const getUrl = `http://${server}/user/idRole?accessToken=${token}`;

    const results = await fetch(getUrl);
    const user = await results.json();
    if (results.ok && user) {
      return user;
    } else {
      return {};
    }
  } catch (err) {
    return {};
  }
}
