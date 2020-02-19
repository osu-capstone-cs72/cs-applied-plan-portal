/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import BounceLoader  from "react-spinners/BounceLoader";
import PropTypes from "prop-types";

function PageSpinner(props) {

  const style = css`
      visibility: ${props.loading ? "visible" : "hidden"};
      position: fixed;
      margin-left: -75px;
      margin-bottom: 75px;
      left: 50%;
      bottom: 50%;
      width: 0;
      height: 0;
      z-index: 99;
  `;

  return (

    <div className="loader-container" css={style}>
      <BounceLoader
        size={150}
        color={"orange"}
      />
    </div>

  );
}
export default PageSpinner;

PageSpinner.propTypes = {
  loading: PropTypes.bool
};