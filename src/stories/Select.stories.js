import React, { useState } from "react";
import { Select } from "../components/Select"; // Adjust the path if needed

export default {
  title: "Components/Select",
  component: Select,
};

const Template = (args) => {
  const [value, setValue] = useState(args.value || "");

  return (
    <Select
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  label: "Choose an option",
  placeholder: "Select an option...",
  options: ["Option 1", "Option 2", "Option 3"],
};

export const WithObjects = Template.bind({});
WithObjects.args = {
  label: "Select a country",
  placeholder: "Select country...",
  options: [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "fr", label: "France" },
  ],
};

export const Searchable = Template.bind({});
Searchable.args = {
  label: "Search for an option",
  placeholder: "Start typing...",
  searchable: true,
  options: [
    "Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grapes",
  ],
};

export const Clearable = Template.bind({});
Clearable.args = {
  label: "Clearable Select",
  placeholder: "Choose something...",
  clearable: true,
  options: ["Option A", "Option B", "Option C"],
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled Select",
  placeholder: "Cannot select...",
  disabled: true,
  options: ["One", "Two", "Three"],
};

export const WithError = Template.bind({});
WithError.args = {
  label: "Select with error",
  placeholder: "Select...",
  error: "This field is required.",
  options: ["First", "Second", "Third"],
};

export const PreSelected = Template.bind({});
PreSelected.args = {
  label: "Pre-selected Option",
  placeholder: "Select...",
  options: ["Alpha", "Beta", "Gamma"],
  value: "Beta",
};
