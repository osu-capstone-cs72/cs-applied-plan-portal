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

  return (
    <div className="plan-reviews" css={style}>
      <h2>History</h2>
      {props.reviews.map((review) => (
        <Review key={review.planId + " " + review.userId} status={review.status}
          time={review.time} />
      ))}
    </div>
  );

}
export default PlanReviews;

PlanReviews.propTypes = {
  onUpdate: PropTypes.any,
  reviews: PropTypes.array
};