/** @jsx jsx */

import Comment from "./Comment";
import CreateComment from "./CreateComment";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function PlanComments(props) {

  const style = css`
    margin: 50px auto;
    text-align: center;
    width: 100%;
  `;

  function handleAddComment () {
    props.onUpdate();
  }

  return (
    <div className="plan-comments" css={style}>
      <h2>Comments</h2>
      <CreateComment onUpdate={() => { handleAddComment(); }}/>
      {props.comments.map((comment) => (
        <Comment key={comment.commentId} commentId={comment.commentId}
          userId={comment.userId} time={comment.time} text={comment.text} />
      ))}
    </div>
  );

}
export default PlanComments;

PlanComments.propTypes = {
  onUpdate: PropTypes.any,
  comments: PropTypes.array
};