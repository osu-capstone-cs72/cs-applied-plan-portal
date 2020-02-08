import React from "react";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import PropTypes from "prop-types";

function PlanComments(props) {

  function handleAddComment () {
    props.onUpdate();
  }

  return (
    <div className="plan-comments">
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