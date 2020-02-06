import React from "react";

class PageNotFound extends React.Component {
  render() {
    return (

      <div className="status-container">
        <h1 className="status-code">404 Page Not Found</h1>
        <p className="status-text">The page you are looking for doesn't exist.</p>
      </div>

    );
  }
}
export default PageNotFound;