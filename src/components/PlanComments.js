import React from "react";
import Comment from "./Comment";

export default class planComments extends React.Component {

  render() {
    return (
      <div className="plan-comments">
        <h2>Comments</h2>
        <Comment />
      </div>
    );
  }

}