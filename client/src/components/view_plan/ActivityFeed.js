/** @jsx jsx */

import Comment from "./Comment";
import Review from "./Review";
import CreateComment from "./CreateComment";
import {css, jsx} from "@emotion/core";
import PropTypes from "prop-types";

function ActivityFeed(props) {

  const style = css`
    margin: 50px auto;
    text-align: center;
    width: 100%;
  `;

  // if (props.activity.length > 0) {
  return (
    <div id="plan-activity" css={style}>
      <h2>Activity Feed</h2>
      <CreateComment currentUser={props.currentUser}
        onNewComment={e => props.onNewComment(e)}/>
      {props.activity.map((obj) => {
        if (obj.commentId > 0) {
          return <Comment key={obj.commentId + "c"} commentId={obj.commentId}
            userId={obj.userId} time={obj.time} text={obj.text}
            firstName={obj.firstName} lastName={obj.lastName}/>;
        } else {
          return <Review key={obj.reviewId + "r"} userId={obj.advisorId}
            status={obj.status} time={obj.time}
            userName={obj.firstName + " " + obj.lastName} />;
        }
      })}
    </div>
  );

}
export default ActivityFeed;

ActivityFeed.propTypes = {
  onUpdate: PropTypes.any,
  activity: PropTypes.array,
  currentUser: PropTypes.object,
  onNewComment: PropTypes.func
};