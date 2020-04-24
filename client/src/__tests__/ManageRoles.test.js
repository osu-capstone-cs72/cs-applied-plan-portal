/* eslint-disable no-undef */
import React from "react";
import {MemoryRouter} from "react-router-dom";
import renderer from "react-test-renderer";

import ManageRoles from "../components/manage_roles/ManageRoles";

describe("Manage roles", () => {

  it("renders successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter initialEntries={["/manageRoles"]}>
        <ManageRoles />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});