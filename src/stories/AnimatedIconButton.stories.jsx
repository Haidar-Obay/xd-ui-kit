import React from "react";
import { AnimatedIconButton } from "../components/Button"; // Adjust path

export default {
  title: "Button/AnimatedIconButton",
  component: AnimatedIconButton,
};

export const Default = (args) => (
  <AnimatedIconButton {...args}>Continue</AnimatedIconButton>
);

Default.args = {
  // You can add props here if needed
};
