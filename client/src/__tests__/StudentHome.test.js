/* eslint-disable no-undef */
import React from "react";
import Enzyme, {mount} from "enzyme";
import {BrowserRouter as Router} from "react-router-dom";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import Cookies from "js-cookie";

import setCookies from "../cookieInfo";
import StudentHome from "../components/student_home/StudentHome";


Enzyme.configure({adapter: new Adapter()});

describe("Student home", () => {

  beforeEach(() => {
    // create a mock function using jest.fn()
    const mockSet = jest.fn();

    // here we are trying to mock the 'set' functionality of Cookie
    Cookies.set = mockSet;

    // call the set method of Cookies
    setCookies("userId", "12002489701"); // Luke Skywalker
    setCookies("role", "1");

  });

  it("matches snapshot", () => {
    const home = renderer.create(
      <Router>
        <StudentHome />
      </Router>).toJSON();
    expect(home).toMatchSnapshot();
  });

  it("allows user to view a plan", () => {
    const home = renderer.create(
      <Router>
        <StudentHome />
      </Router>);
    let tree = home.toJSON();
    expect(tree).toMatchSnapshot();

    const instance = mount(
      <Router>
        <StudentHome />
      </Router>);
    instance.find("tr[key=19]").simulate("click");
    tree = instance.toJSON();
    expect(tree).toMatchSnapshot();
  });
});