import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

export default class Navbar extends React.Component {
  static get propTypes() {
    return {
      showSearch: PropTypes.bool,
      searchContent: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="navbar-parent">
        <Link to={"/"}>
          <p className="osu-logo">Oregon State University</p>
        </Link>
        {this.props.showSearch ? <input id="navbar-search" className="form-control mr-sm-2" type="text" placeholder={this.props.searchContent} name="search"/> : null}
        <p>Log out</p>
      </div>
    );
  }
}