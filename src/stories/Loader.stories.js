import React from "react";
import { Loader } from "../components/Loader"; // Adjust path if needed

export default {
  title: "Components/Loader",
  component: Loader,
  argTypes: {
    color: { control: "color" },
    accentColor: { control: "color" },
    size: {
      control: { type: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    },
    type: {
      control: {
        type: "select",
        options: ["pulse", "orbital", "dots", "spinning", "inventory"],
      },
    },
    theme: { control: { type: "select", options: ["light", "dark"] } },
    preset: {
      control: {
        type: "select",
        options: ["default", "inventory", "shipping", "analytics"],
      },
    },
  },
};

const Template = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Loading...",
  size: "md",
  theme: "light",
  preset: "default",
  type: "pulse",
  showControls: true,
};

export const InventoryPreset = Template.bind({});
InventoryPreset.args = {
  label: "Managing Inventory",
  size: "lg",
  theme: "dark",
  preset: "inventory",
  showControls: true,
};

export const ShippingPreset = Template.bind({});
ShippingPreset.args = {
  label: "Shipping Orders",
  size: "md",
  theme: "dark",
  preset: "shipping",
  type: "orbital",
  showControls: true,
};

export const AnalyticsPreset = Template.bind({});
AnalyticsPreset.args = {
  label: "Analyzing Data",
  size: "xl",
  theme: "light",
  preset: "analytics",
  type: "dots",
  showControls: true,
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  label: "Custom Colors",
  size: "md",
  theme: "dark",
  preset: "default",
  color: "#f97316", // Orange
  accentColor: "#fb923c", // Light Orange
  showControls: true,
};

export const WithProgress = Template.bind({});
WithProgress.args = {
  label: "Uploading Files",
  size: "lg",
  theme: "light",
  preset: "inventory",
  progress: 45,
  showControls: false,
};
