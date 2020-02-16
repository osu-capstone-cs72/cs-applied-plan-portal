/** @jsx jsx */

import Comment from "./Comment";
import CreateComment from "./CreateComment";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function ActivityFeed(props) {

  const style = css`
    margin: 50px auto;
    text-align: center;
    width: 100%;
  `;

  if (props.comments.length > 0) {
    return (
      <div className="plan-comments" css={style}>
        <h2>Activity Feed</h2>
        <CreateComment currentUser={props.currentUser}
          onNewComment={e => props.onNewComment(e)}/>
        {props.comments.map((comment) => (
          <Comment key={comment.commentId} commentId={comment.commentId}
            userId={comment.userId} time={comment.time} text={comment.text}
            firstName={comment.firstName} lastName={comment.lastName}/>
        ))}
      </div>
    );
  } else {
    return (
      <div className="plan-comments" css={style}>
        <h2>Activity Feed</h2>
        <CreateComment currentUser={props.currentUser}
          onNewComment={e => props.onNewComment(e)}/>
      </div>
    );
  }

}
export default ActivityFeed;

ActivityFeed.propTypes = {
  onUpdate: PropTypes.any,
  comments: PropTypes.array,
  currentUser: PropTypes.object
};