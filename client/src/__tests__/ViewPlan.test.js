/* eslint-disable no-undef */
import React from "react";
import {MemoryRouter} from "react-router-dom";
import renderer from "react-test-renderer";

import ViewPlan from "../components/view_plan/ViewPlan";

describe("View plan", () => {

  it("renders successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter initialEntries={["/viewPlan/10"]}>
        <ViewPlan history={{}}/>
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});