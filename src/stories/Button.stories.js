import React from "react";
import { Button } from "../components/Button";

export default {
  title: "Button/Button",
  component: Button,
};

export const Default = (args) => <Button {...args} />;
Default.args = {
  children: "Click Me",
  variant: "danger",
  size: "xl", 
  fullWidth: false,
  disabled: false,
  loading: false,
};
