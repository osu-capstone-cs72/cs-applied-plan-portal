/* eslint-disable no-undef */
import React from "react";
// import Enzyme from "enzyme";
// import Adapter from "enzyme-adapter-react-16";
import {MemoryRouter} from "react-router-dom";
import renderer from "react-test-renderer";
// import Cookies from "js-cookie";

import StudentCreatePlan from "../components/create_plan/StudentCreatePlan";

// Enzyme.configure({adapter: new Adapter()});

describe("Student create plan", () => {

  // beforeEach(() => {
  //   // create a mock function using jest.fn()
  //   const mockSet = jest.fn();

  //   // here we are trying to mock the 'set' functionality of Cookie
  //   Cookies.set = mockSet;

  //   // call the set method of Cookies
  //   setCookie("userId", "50734529811");
  //   setCookie("role", "0");

  // });

  it("renders successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter initialEntries={["/createPlan"]}>
        <StudentCreatePlan />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});