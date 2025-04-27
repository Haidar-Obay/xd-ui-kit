import React from "react";
import { Loader } from "../components/Loader";

export default {
  title: "Components/Loader",
  component: Loader,
};

export const Default = () => (
  <Loader
    preset="shipping"
    type="orbital"
    theme="dark"
    label="Processing Orders"
    showControls={true}
  />
);
