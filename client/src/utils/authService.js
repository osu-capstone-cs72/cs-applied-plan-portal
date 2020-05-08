import cookie from "cookie";
import url from "url";
import validator from "validator";

// Parses cookies and checks whether the user is logged in.
//
// Returns an object containing the userId and the role of the user.
// On error returns a student with a user ID of 0.
export function getProfile() {
  return {
    userId: 82757579527,
    role: 0,
  };

}

// checks if the current user is logged in
export function loggedIn() {

  const profile = getProfile();
  const userId = profile.userId;

  return !!userId;

}

// clear user cookies then redirect the user to the OSU logout page
export function logout() {

  // remove the user cookies
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // redirect to the CAS logout page
  window.location.href = url.format({
    protocol: "https",
    hostname: "login.oregonstate.edu",
    pathname: "/idp-dev/profile/cas/logout",
  });

}

// clear user cookies and then redirect the user to the OSU login page
export function login() {

  // redirect to OSU login page
  let server = `${process.env.REACT_APP_API_HOST}`;
  if (process.env.ENV !== "PRODUCTION") {
    server += `:${process.env.REACT_APP_API_PORT}`;
  }
  window.location.href = url.format({
    protocol: "https",
    hostname: "login.oregonstate.edu",
    pathname: "/idp-dev/profile/cas/login",
    // callback URL for CAS
    query: {
      service: url.format({
        protocol: process.env.ENV === "PRODUCTION" ? "https" : "http",
        host: server,
        pathname: "/api/user/login",
        // callback URL has its own query string
        query: {
          target: url.format({
            protocol: process.env.ENV === "PRODUCTION" ? "https" : "http",
            host: server
          })
        }
      })
    }
  });

}
