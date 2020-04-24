/* eslint-disable no-undef */
import React from "react";
import {MemoryRouter} from "react-router-dom";
import renderer from "react-test-renderer";

import AdvisorHome from "../components/advisor_home/AdvisorHome";


describe("Advisor home", () => {

  it("renders successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <AdvisorHome />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});