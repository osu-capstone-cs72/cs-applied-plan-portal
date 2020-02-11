/** @jsx jsx */

import {useState, useEffect} from "react";
import {css, jsx} from "@emotion/core";
import BeatLoader  from "react-spinners/BeatLoader";
import PropTypes from "prop-types";

function Reviews(props) {

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const style = css`
    display: inline-block;
    margin: 25px;
    padding: 5px;
    width: 175px;
    height: 175px;
    border-radius: 50%;
    background-color: #b3b3b3;

    .review-text-container {
      position: relative;
      top: 30px;
    }

    .review-loader-container {
      display: ${loading ? "block" : "none"};
      margin: auto;
      width: 125px;
      height: 25px;
    }

    .review-status-text {
      font-weight: bold;
      font-size: medium;
    }

    .review-time {
      font-style: italic;
    }

    .review-user {
      font-size: medium;
    }
  `;

  useEffect(() => {

    async function fetchUsername() {
      // don't try searching for user name if ID is null
      if (props.userId === null) {
        return;
      }

      try {
        // get user name
        const server = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
        const url = `http://${server}/user/${props.userId}`;
        const response = await fetch(url);
        if (response.ok) {
          // get data from the response
          const obj = await response.json();
          setUserName(obj.firstName + " " + obj.lastName);
          setLoading(false);
        }
      } catch (err) {
        // this is a server error
        console.log("An internal server error occurred. Please try again later.");
      }
    }
    fetchUsername();
  }, [props.userId]);

  function renderStatus() {
    switch (props.status) {
      case 0:
        return "Rejected";
      case 1:
        return "Awaiting student changes";
      case 2:
        return "Awaiting review";
      case 3:
        return "Awaiting final review";
      case 4:
        return "Accepted";
      default:
        return "Undefined status";
    }
  }

  if (props.commentId !== 0) {
    return (
      <div className="review-container" css={style}>
        <div className="review-text-container">
          <p className="review-status-text">{renderStatus(props.status)}</p>
          <p className="review-user">{userName}</p>
          <div className="review-loader-container">
            <BeatLoader>
              size={150}
              color={"black"}
              rotate={90}
            </BeatLoader>
          </div>
          <p className="review-time">{props.time}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }

}
export default Reviews;

Reviews.propTypes = {
  userId: PropTypes.number,
  status: PropTypes.number,
  time: PropTypes.string
};