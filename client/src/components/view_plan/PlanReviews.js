/** @jsx jsx */

import Review from "./Review";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function PlanReviews(props) {

  const style = css`
    margin: 50px auto;
    text-align: center;
    width: 100%;
  `;

  if (props.reviews.length > 0) {
    return (
      <div className="plan-reviews" css={style}>
        <h2>History</h2>
        <Review key={0} userId={props.userId} status={2} time={props.planCreated} />
        {props.reviews.map((review) => (
          <Review key={review.planId + "-" + review.advisorId} userId={review.advisorId}
            status={review.newStatus} time={review.timeReviewed} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="plan-reviews" css={style}>
        <h2>History</h2>
        <Review key={0} userId={props.userId} status={2} time={props.planCreated} />
      </div>
    );
  }

}
export default PlanReviews;

PlanReviews.propTypes = {
  reviews: PropTypes.array,
  userId: PropTypes.number,
  status: PropTypes.number,
  planCreated: PropTypes.any
};