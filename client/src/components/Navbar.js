/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {logout} from "../utils/authService";
import {withRouter} from "react-router-dom";

function Navbar(props) {

  const style = css`
  `;

  function logoutUser() {
    logout();
    props.history.push("/login");
  }

  return (
    <div className="navbar-parent" css={style}>
      <Link to={"/"}>
        <p className="osu-logo">Oregon State University</p>
      </Link>
      {props.showSearch ? <input id="navbar-search" className="form-control mr-sm-2" type="text" placeholder={props.searchContent} name="search"/> : null}
      <button className="logout" onClick={() => logoutUser()}>Log out</button>
    </div>
  );

}
export default withRouter(Navbar);

Navbar.propTypes = {
  history: PropTypes.object,
  showSearch: PropTypes.bool,
  searchContent: PropTypes.string
};