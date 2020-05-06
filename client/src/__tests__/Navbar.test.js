/* eslint-disable no-undef */
import React from "react";
import {MemoryRouter} from "react-router-dom";
import renderer from "react-test-renderer";

import Navbar from "../components/navbar/Navbar";

describe("Navbar", () => {

  it("renders successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <Navbar currentPlan={0} />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});