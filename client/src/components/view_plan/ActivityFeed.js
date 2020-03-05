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

  return (
    <div id="plan-activity" css={style}>
      <h2>Activity Feed</h2>
      <CreateComment currentUser={props.currentUser} status={props.status}
        onNewComment={e => props.onNewComment(e)}/>
      {props.activity.map((obj) => {
        if (obj.id.charAt(obj.id.length - 1) === "c") {
          return <Comment key={obj.id}
            userId={obj.userId} time={obj.time} text={obj.text}
            firstName={obj.firstName} lastName={obj.lastName}/>;
        } else {
          return <Review key={obj.id} userId={obj.advisorId}
            status={obj.status} time={obj.time}
            userName={obj.firstName + " " + obj.lastName} />;
        }
      })}
      { props.cursor.primary === "null" ? (
        null
      ) : (
        <button id="page-load-more-button" onClick={() => props.onShowMore(props.cursor)}>Show More</button>
      )}
    </div>
  );

}
export default ActivityFeed;

ActivityFeed.propTypes = {
  status: PropTypes.number,
  onUpdate: PropTypes.any,
  activity: PropTypes.array,
  currentUser: PropTypes.object,
  onNewComment: PropTypes.func,
  onShowMore: PropTypes.func,
  cursor: PropTypes.object
};