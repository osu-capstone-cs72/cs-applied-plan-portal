import React from "react";

export default class Comment extends React.Component {

  render() {
    return (
      <div className="comment-container">
        <p className="comment-user">Han Solo</p>
        <p className="comment-time">2/4/2020 5pm</p>
        <p className="comment-text">This is a comment</p>
      </div>
    );
  }

}