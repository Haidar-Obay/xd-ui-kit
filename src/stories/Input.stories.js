import React, { useState } from "react";
import { Input } from "../components/Input"; // Adjust path if needed
import { Search, Mail } from "lucide-react";

export default {
  title: "Components/Input",
  component: Input,
};

const Template = (args) => {
  const [value, setValue] = useState(args.value || "");

  return (
    <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  );
};

// --- Basic Variations ---

export const TextInput = Template.bind({});
TextInput.args = {
  label: "Username",
  placeholder: "Enter your username",
  type: "text",
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
  label: "Password",
  placeholder: "Enter your password",
  type: "password",
};

export const SearchInput = Template.bind({});
SearchInput.args = {
  label: "Search",
  placeholder: "Search for something...",
  type: "search",
};

export const DisabledInput = Template.bind({});
DisabledInput.args = {
  label: "Disabled Input",
  placeholder: "Cannot type here",
  disabled: true,
  type: "text",
};

export const InputWithError = Template.bind({});
InputWithError.args = {
  label: "Email",
  placeholder: "Enter your email",
  error: "Invalid email address",
  type: "email",
};

export const ClearableInput = Template.bind({});
ClearableInput.args = {
  label: "Clearable Input",
  placeholder: "Type and clear...",
  clearable: true,
  type: "text",
};

export const InputWithIcon = Template.bind({});
InputWithIcon.args = {
  label: "Email Address",
  placeholder: "example@mail.com",
  type: "email",
  icon: <Mail size={18} className="text-gray-400" />,
};

export const PreFilledInput = Template.bind({});
PreFilledInput.args = {
  label: "Prefilled Username",
  placeholder: "Enter username",
  type: "text",
  value: "JohnDoe123",
};
