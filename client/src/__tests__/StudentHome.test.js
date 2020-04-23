/* eslint-disable no-undef */
import React from "react";
import Enzyme, {mount} from "enzyme";
import StudentHome from "../components/student_home/StudentHome";
import {BrowserRouter as Router} from "react-router-dom";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});

// set default user cookies to test with
beforeEach(() => {
  document.cookie = "userId=50734529811; path=/";
  document.cookie = "role=0; path=/";
});

it("Renders without crashing2", () => {
  mount(
    <Router>
      <StudentHome />
    </Router>);
});
