/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import {useEffect} from "react";
import PropTypes from "prop-types";

function LoadMoreButton(props) {

  const style = css`

    & {
      margin: 25px;
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid black;
      background: transparent;
      margin-left: 1rem;
    }

  `;

  // check if we are already scrolled to the bottom of the page
  // when this component first appears
  useEffect(() => {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2
      && !props.loading) {
      checkLoading();
    }
    // eslint-disable-next-line
  }, [props.loading]);

  // checks to see if the user has reached the bottom of the page
  // so that we can load more results
  window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
      checkLoading();
    }
  };

  // checks to see if the page is already loading results,
  // if this is the case then we do not ask for more to load
  function checkLoading() {

    if (!props.loading) {
      props.onUpdate();
    }

  }

  return (
    <button id="load-more-button" css={style}
      onClick={() => checkLoading()}>
        Show More
    </button>
  );

}
export default LoadMoreButton;

LoadMoreButton.propTypes = {
  onUpdate: PropTypes.func,
  loading: PropTypes.bool
};