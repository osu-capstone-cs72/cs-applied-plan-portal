import cookie from "cookie";
import url from "url";
import validator from "validator";

// Parses the authentication fields from the cookie and checks whether the user
// is logged in.
//
// Returns an object containing the userId and the role of the user if the
// cookie contains some auth fields. Note that these auth fields may not be
// accurate, and thus the cookie shall be verified by the API server for every
// request.
// Returns `false` if the cookie doesn't exist, or if the parsing process throws
// an exception, or if the parsed object doesn't contain correct fields.
export function getProfile() {

  try {
    // parse the cookie included in document; must string-coerce it because
    // cookie.parse() throws on non-string arguments
    const cookieObj = cookie.parse(`${document.cookie}`);

    console.log("getProfile(): cookieObj =", cookieObj);

    // ensure the parsed cookie is a JS object (it should always be)
    // and all the auth fields exists
    if (cookieObj !== Object(cookieObj) ||
        !cookieObj.userId ||
        !cookieObj.role ||
        !cookieObj.csrf/* ||
        !cookieObj.auth*/) {
      return false;
    }

    // ensure userId and role are non-negative integers
    if (!validator.isInt(cookieObj.userId + "") ||
        !validator.isInt(cookieObj.role + "")) {
      return false;
    }

    // success case; return an object containing userId and role in integers
    return {
      userId: validator.toInt(cookieObj.userId),
      role: validator.toInt(cookieObj.role)
    };
  } catch (err) {
    // if anything throws during this process, reject the auth
    return false;
  }
}

// log the current user out
export function logout() {

  // remove the user cookies
  document.cookie = null;
  // document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // redirect to the CAS logout page
  window.location.href = url.format({
    protocol: "https",
    hostname: "login.oregonstate.edu",
    pathname: "/idp-dev/profile/cas/logout",
  });

}
