import React from "react";
import Navbar from "./Navbar";

export default class SetRoles extends React.Component {
  render() {
    return (
      <div>
        <Navbar showSearch={false} searchContent={null}/>
        <div className="set-roles">
        Set roles
        </div>
      </div>
    );
  }
}