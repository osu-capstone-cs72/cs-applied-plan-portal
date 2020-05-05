/* eslint-disable no-undef */
import React from "react";
import {MemoryRouter} from "react-router-dom";
import renderer from "react-test-renderer";

import ErrorMessage from "../components/general/ErrorMessage";
import PageInternalError from "../components/general/PageInternalError";
import PageNotFound from "../components/general/PageNotFound";

describe("Error messages", () => {

  it("renders error message successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <ErrorMessage text={"Some error occurred."} />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it("renders page internal error successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter initialEntries={["/500"]}>
        <PageInternalError />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it("renders page not found successfully", () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});