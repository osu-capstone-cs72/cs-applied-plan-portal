import React from "react";
import {Link} from "react-router-dom";


class Home extends React.Component {
  render() {
    return (

      <div className="App">
        <h1>Project Home</h1>

        <Link to={"./createPlan"}>
          <button variant="raised">
            Create Plan
          </button>
        </Link>

        <Link to={"./viewPlan"}>
          <button variant="raised">
            View Plan
          </button>
        </Link>

      </div>

    );
  }
}
export default Home;