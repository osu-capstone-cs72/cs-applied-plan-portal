/* eslint-disable no-undef */
import React from "react";
import Enzyme, {mount} from "enzyme";
import StudentCreatePlan from "../components/create_plan/StudentCreatePlan";
import {BrowserRouter as Router} from "react-router-dom";
import Adapter from "enzyme-adapter-react-16";
import {MemoryRouter} from "react-router-dom";
import setCookies from "../cookieInfo";
import Cookies from "js-cookie";

Enzyme.configure({adapter: new Adapter()});

describe("Student create plan", () => {

  beforeEach(() => {
    // create a mock function using jest.fn()
    const mockSet = jest.fn();

    // here we are trying to mock the 'set' functionality of Cookie
    Cookies.set = mockSet;

    // call the set method of Cookies
    setCookies("userId", "50734529811");
    setCookies("role", "0");

  });

  it("renders successfully", () => {
    mount(
      <MemoryRouter initialEntries={["/createPlan"]}>
        <StudentCreatePlan />
      </MemoryRouter>);
  });
});