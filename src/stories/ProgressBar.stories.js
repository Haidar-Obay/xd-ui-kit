import React from "react";
import { ProgressBar } from "../components/ProgressBar"; // Adjust path if needed

export default {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["normal", "success", "error", "warning"],
    },
    labelPosition: {
      control: { type: "select" },
      options: ["top", "inside", "bottom"],
    },
  },
};

const Template = (args) => <ProgressBar {...args} />;

// --- Stories ---

export const Basic = Template.bind({});
Basic.args = {
  progress: 50,
  label: "Loading",
};

export const WithPercentage = Template.bind({});
WithPercentage.args = {
  progress: 70,
  label: "Uploading Files",
  showPercentage: true,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  indeterminate: true,
  label: "Processing",
  height: 12,
  barColor: "#3b82f6",
};

export const StripedAnimated = Template.bind({});
StripedAnimated.args = {
  progress: 45,
  striped: true,
  animated: true,
  label: "Uploading",
  height: 14,
};

export const SuccessStatus = Template.bind({});
SuccessStatus.args = {
  progress: 100,
  label: "Completed",
  showStatus: true,
  status: "success",
};

export const ErrorStatus = Template.bind({});
ErrorStatus.args = {
  progress: 40,
  label: "Upload Failed",
  showStatus: true,
  status: "error",
};

export const InsideLabel = Template.bind({});
InsideLabel.args = {
  progress: 65,
  label: "Progress",
  labelPosition: "inside",
  showPercentage: true,
  height: 20,
};

export const BottomLabel = Template.bind({});
BottomLabel.args = {
  progress: 30,
  label: "Downloading",
  labelPosition: "bottom",
  showPercentage: true,
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  progress: 55,
  label: "Custom",
  barColor: "#10b981", // Teal
  backgroundColor: "#d1fae5", // Light green
  height: 16,
  borderRadius: 8,
};
