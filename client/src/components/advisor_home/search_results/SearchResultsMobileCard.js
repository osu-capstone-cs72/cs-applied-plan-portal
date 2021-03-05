/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { formatTime } from "../../../utils/formatTime";
import { statusText } from "../../../utils/renderStatus";
import { BOX_SHADOW_CARD, MOBILE_WIDTH } from "../../../utils/constants";

function SearchResultsMobileCard({ plan }) {
  const style = css`
    & {
      width: ${MOBILE_WIDTH};
      box-shadow: ${BOX_SHADOW_CARD};
      margin: 1rem auto;
      padding: 1rem;
      border-radius: 0.7rem;
      background: white;
    }

    .cardItem {
      margin-bottom: 0.4rem;
    }

    .title {
      font-weight: 600;
    }

    .text {
      font-weight: 400;
    }
  `;
  return (
    <div css={style}>
      <div className="cardItem">
        <span className="title">Username: </span>
        <span className="text">{`${plan.firstName} ${plan.lastName}`}</span>
      </div>
      <div className="cardItem">
        <span className="title">User ID: </span>
        <span className="text">{plan.userId}</span>
      </div>
      <div className="cardItem">
        <span className="title">Plan Name: </span>
        <span className="text">{plan.planName}</span>
      </div>
      <div className="cardItem">
        <span className="title">Status: </span>
        <span className="text">{statusText(plan.status)}</span>
      </div>
      <div className="cardItem">
        <span className="title">Time Created: </span>
        <span className="text">{formatTime(plan.created)}</span>
      </div>
      <div className="cardItem">
        <span className="title">Time Updated: </span>
        <span className="text">{formatTime(plan.lastUpdated)}</span>
      </div>
    </div>
  );
}

export default SearchResultsMobileCard;

SearchResultsMobileCard.propTypes = {
  plan: PropTypes.object,
};
