import React from "react";

class PageInternalError extends React.Component {
  render() {
    return (

      <div className="status-container">
        <h1 className="status-code">500 Internal Server Error</h1>
        <p className="status-text">The server encountered an internal error
          and was unable to complete your request.</p>
      </div>

    );
  }
}
export default PageInternalError;