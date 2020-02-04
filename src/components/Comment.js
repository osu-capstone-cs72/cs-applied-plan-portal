import React from "react";
import PropTypes from "prop-types";

export default class Comment extends React.Component {
  static get propTypes() {
    return {
      commentId: PropTypes.number,
      userId: PropTypes.number,
      time: PropTypes.any,
      text: PropTypes.string
    };
  }

  render() {
    if (this.props.commentId !== 0) {
      return (
        <div className="comment-container">
          <p className="comment-user">{this.props.userId}</p>
          <p className="comment-time">{this.props.time}</p>
          <p className="comment-text">{this.props.text}</p>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }

}