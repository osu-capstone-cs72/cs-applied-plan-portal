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

  constructor(props) {
    super(props);

    this.state = {
      studentName: ""
    };
  }

  async componentDidMount() {

    // don't try searching for user name if ID is zero
    if (this.props.userId === 0) {
      return;
    }

    try {
      // get user name
      const url = `/api/user/${this.props.userId}`;
      const response = await fetch(url);
      if (response.ok) {
        // get data from the response
        const obj = await response.json();
        this.setState({
          studentName: obj.firstName + " " + obj.lastName
        });
      } else {
        // we got a bad status code
        try {
          throw response;
        } catch (err) {
          err.text().then(errorMessage => {
            alert(errorMessage);
          });
        }
      }
    } catch (err) {
      // this is a server error
      alert("An internal server error occurred. Please try again later.");
    }
  }

  render() {
    if (this.props.commentId !== 0) {
      return (
        <div className="comment-container">
          <p className="comment-user">{this.state.studentName}</p>
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