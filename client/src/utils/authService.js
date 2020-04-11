import cookie from "cookie";
import url from "url";
import validator from "validator";

// Parses cookies and checks whether the user is logged in.
//
// Returns an object containing the userId and the role of the user.
// On error returns a student with a user ID of 0.
export function getProfile() {

  try {

    // parse the cookie included in document; must string-coerce it because
    // cookie.parse() throws on non-string arguments
    const cookieObj = cookie.parse(`${document.cookie}`);

    // ensure the parsed cookies are a JS object (it should always be)
    if (cookieObj !== Object(cookieObj)) {
      throw new Error("Cookies are not a valid JS object");
    }

    // ensure that the userId and role cookies exist
    if (!cookieObj.userId || !cookieObj.role) {
      throw new Error("User ID or role cookie not set");
    }

    // ensure userId and role are non-negative integers
    if (!validator.isInt(cookieObj.userId + "") ||
        !validator.isInt(cookieObj.role + "")) {
      throw new Error("Negative user ID or role");
    }

    // success case; return an object containing userId and role in integers
    return {
      userId: validator.toInt(cookieObj.userId),
      role: validator.toInt(cookieObj.role)
    };

  } catch (err) {

    // on error ensure that the user cookies are removed
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // return an invalid user
    console.error(err);
    return {
      userId: 0,
      role: 0
    };

  }
}

// checks if the current user is logged in
export function loggedIn() {

  const profile = getProfile();
  const userId = profile.userId;

  return !!userId;

}

// log the current user out
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
