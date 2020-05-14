/* eslint-disable no-undef */
import React from "react";
// import Enzyme from "enzyme";
import {BrowserRouter as Router} from "react-router-dom";
// import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
// import Cookies from "js-cookie";

import StudentHome from "../components/student_home/StudentHome";


// Enzyme.configure({adapter: new Adapter()});

describe("Student home", () => {

  // beforeEach(() => {
  //   // create a mock function using jest.fn()
  //   const mockSet = jest.fn();

  //   // here we are trying to mock the 'set' functionality of Cookie
  //   Cookies.set = mockSet;

  //   // call the set method of Cookies
  //   setCookie("userId", "12002489701"); // Luke Skywalker
  //   setCookie("role", "1");

  // });

  it("renders successfully", () => {
    const home = renderer.create(
      <Router>
        <StudentHome />
      </Router>).toJSON();
    expect(home).toMatchSnapshot();
  });
});