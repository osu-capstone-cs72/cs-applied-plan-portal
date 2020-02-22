import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";

function AuthService(props) {

  // get token from the api server
  function login() {
    props.history.push("/login");
  }

  // check if there is a valid saved token
  function loggedIn() {
    const token = getToken();
    return !!token && !isTokenExpired(token);
  }

  // check if token is expired
  function isTokenExpired(token) {
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
  function setToken(idToken) {
    localStorage.setItem("id_token", idToken);
  }

  // get token from local storage
  function getToken() {
    return localStorage.getItem("id_token");
  }

  // clear token from local storage
  function logout() {
    localStorage.removeItem("id_token");
  }

  // get payload data from token
  function getProfile() {
    return jwtDecode(getToken());
  }

}
export default withRouter(AuthService);

AuthService.propTypes = {
  history: PropTypes.object
};
