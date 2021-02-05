/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";


function SearchResultsMobileCard({plan}) {
  const style = css`
    & {
      margin: 0;
      padding: 0;
    }
   `;
  return (
    <div css={style}>
      <div className="username">
        <span className="title">Username: </span>
        <span className="text">{`${plan.firstName} ${plan.lastName}`}</span>
      </div>
    </div>
  );
}

export default SearchResultsMobileCard;

SearchResultsMobileCard.propTypes = {
  plan: PropTypes.object
};