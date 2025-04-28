import React from "react";
import {
  Button,
  PulseButton,
  AnimatedIconButton,
  ButtonGroup,
} from "../components/Button"; // Adjust path if needed
import { Plus, Trash, Check } from "lucide-react";

export default {
  title: "Components/Button",
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "Primary Button",
  variant: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: "Secondary Button",
  variant: "secondary",
};

export const Outline = Template.bind({});
Outline.args = {
  children: "Outline Button",
  variant: "outline",
};

export const Danger = Template.bind({});
Danger.args = {
  children: "Danger Button",
  variant: "danger",
};

export const Success = Template.bind({});
Success.args = {
  children: "Success Button",
  variant: "success",
};

export const LinkButton = Template.bind({});
LinkButton.args = {
  children: "Link Button",
  variant: "link",
  href: "https://example.com",
  target: "_blank",
};

export const LoadingButton = Template.bind({});
LoadingButton.args = {
  children: "Saving...",
  loading: true,
  variant: "primary",
  loadingText: "Loading...",
};

export const WithLeftIcon = Template.bind({});
WithLeftIcon.args = {
  children: "Add Item",
  variant: "primary",
  leftIcon: <Plus size={16} />,
};

export const WithRightIcon = Template.bind({});
WithRightIcon.args = {
  children: "Next",
  variant: "primary",
  rightIcon: <Check size={16} />,
};

export const IconOnlyButton = Template.bind({});
IconOnlyButton.args = {
  iconOnly: true,
  variant: "outline",
  leftIcon: <Trash size={18} />,
  ariaLabel: "Delete",
};

export const FullWidthButton = Template.bind({});
FullWidthButton.args = {
  children: "Full Width",
  variant: "primary",
  fullWidth: true,
};

export const RoundedButton = Template.bind({});
RoundedButton.args = {
  children: "Rounded",
  variant: "success",
  rounded: true,
};

export const ElevatedButton = Template.bind({});
ElevatedButton.args = {
  children: "Elevated",
  variant: "primary",
  elevated: true,
};

export const PulseButtonStory = (args) => (
  <PulseButton {...args}>Important Action</PulseButton>
);
PulseButtonStory.storyName = "Pulse Button";

export const AnimatedIconButtonStory = (args) => (
  <AnimatedIconButton {...args}>Continue</AnimatedIconButton>
);
AnimatedIconButtonStory.storyName = "Animated Icon Button";

export const ButtonGroupStory = (args) => (
  <ButtonGroup {...args}>
    <Button variant="primary">Left</Button>
    <Button variant="secondary">Middle</Button>
    <Button variant="danger">Right</Button>
  </ButtonGroup>
);
ButtonGroupStory.storyName = "Button Group";
