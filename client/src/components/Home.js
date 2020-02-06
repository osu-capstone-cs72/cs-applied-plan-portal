import React from "react";
import {Link} from "react-router-dom";


class Home extends React.Component {
  render() {
    return (

      <div className="home-container">
        <h1>Project Home</h1>

        <Link to={"./createPlan"}>
          <button className="home-button" variant="raised">
            Create Plan
          </button>
        </Link>

        <Link to={"./viewPlan"}>
          <button className="home-button" variant="raised">
            View Plan
          </button>
        </Link>

      </div>

    );
  }
}
export default Home;