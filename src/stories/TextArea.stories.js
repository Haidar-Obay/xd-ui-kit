import React, { useState } from "react";
import { TextArea } from "../components/TextArea"; // Adjust path if needed

export default {
  title: "Components/TextArea",
  component: TextArea,
};

const Template = (args) => {
  const [value, setValue] = useState(args.value || "");

  return (
    <TextArea
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

// --- Stories ---

export const BasicTextArea = Template.bind({});
BasicTextArea.args = {
  label: "Your Message",
  placeholder: "Type your message here...",
  rows: 4,
};

export const RequiredTextArea = Template.bind({});
RequiredTextArea.args = {
  label: "Bio",
  placeholder: "Tell us about yourself",
  rows: 5,
  required: true,
};

export const DisabledTextArea = Template.bind({});
DisabledTextArea.args = {
  label: "Disabled Field",
  placeholder: "You can't type here",
  rows: 3,
  disabled: true,
};

export const TextAreaWithError = Template.bind({});
TextAreaWithError.args = {
  label: "Feedback",
  placeholder: "Write your feedback",
  rows: 4,
  error: "Feedback is required",
};

export const PrefilledTextArea = Template.bind({});
PrefilledTextArea.args = {
  label: "Prefilled Text",
  placeholder: "Type something...",
  rows: 4,
  value: "This is a prefilled textarea example.",
};
