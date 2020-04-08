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
export function getProfile() {

  // establish the default user
  const user = {
    userId: 0,
    role: 0
  };

  // get user info from cookies
  const userId = "userId=";
  const role = "role=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {

    let cookie = cookieArray[i];

    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }

    // if we find a cookie that we are looking for, then update the user object
    if (cookie.indexOf(userId) === 0) {
      user.userId = cookie.substring(userId.length, cookie.length);
    }
    if (cookie.indexOf(role) === 0) {
      user.role = cookie.substring(role.length, cookie.length);
    }
  }

  return user;

}
