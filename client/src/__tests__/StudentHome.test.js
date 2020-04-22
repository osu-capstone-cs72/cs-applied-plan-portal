/* eslint-disable no-undef */
import React from "react";
import Enzyme, {mount} from "enzyme";
import StudentHome from "../components/student_home/StudentHome";
import {BrowserRouter as Router} from "react-router-dom";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});

beforeEach(() => {
  const document = {
    cookie: {
      userId: 50734529811,
      role: 0
    }
  };
  // forces the obj we just created to act like the "document" we are familiar with
  global.document = document;
});

it("Renders without crashing", () => {
  mount(
    <Router>
      <StudentHome />
    </Router>);
});
