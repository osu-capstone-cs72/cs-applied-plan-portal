import React from "react";
import Comment from "./Comment";
import PropTypes from "prop-types";

export default class planComments extends React.Component {
  static get propTypes() {
    return {
      comments: PropTypes.any
    };
  }

  render() {
    return (
      <div className="plan-comments">
        <h2>Comments</h2>
        {this.props.comments.map((comment) => (
          <Comment key={comment.commentId} commentId={comment.commentId}
            userId={comment.userId} time={comment.time} text={comment.text} />
        ))}
      </div>
    );
  }

}