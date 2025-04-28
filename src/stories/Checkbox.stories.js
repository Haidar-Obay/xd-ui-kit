import React, { useState } from "react";
import { Checkbox, CheckboxGroup } from "../components/Checkbox"; // Adjust path if needed

export default {
  title: "Components/Checkbox",
  component: Checkbox,
};

const SingleTemplate = (args) => {
  const [checked, setChecked] = useState(args.checked || false);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
};

const GroupTemplate = (args) => {
  const [value, setValue] = useState(args.value || []);

  return (
    <CheckboxGroup
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

// Single Checkbox stories
export const BasicCheckbox = SingleTemplate.bind({});
BasicCheckbox.args = {
  label: "Accept Terms and Conditions",
  id: "terms",
  name: "terms",
};

export const RequiredCheckbox = SingleTemplate.bind({});
RequiredCheckbox.args = {
  label: "I agree to the privacy policy",
  required: true,
  id: "privacy",
  name: "privacy",
};

export const DisabledCheckbox = SingleTemplate.bind({});
DisabledCheckbox.args = {
  label: "Disabled Option",
  disabled: true,
  id: "disabled",
  name: "disabled",
};

export const CheckboxWithError = SingleTemplate.bind({});
CheckboxWithError.args = {
  label: "Required Agreement",
  error: "You must accept the agreement",
  id: "error-agreement",
  name: "error-agreement",
};

// CheckboxGroup stories
export const BasicCheckboxGroup = GroupTemplate.bind({});
BasicCheckboxGroup.args = {
  label: "Select Interests",
  name: "interests",
  options: ["Technology", "Music", "Sports", "Reading"],
};

export const InlineCheckboxGroup = GroupTemplate.bind({});
InlineCheckboxGroup.args = {
  label: "Choose Hobbies",
  name: "hobbies",
  options: [
    { value: "travel", label: "Travel" },
    { value: "photography", label: "Photography" },
    { value: "cooking", label: "Cooking" },
  ],
  inline: true,
};

export const DisabledCheckboxGroup = GroupTemplate.bind({});
DisabledCheckboxGroup.args = {
  label: "Disabled Choices",
  name: "disabled-choices",
  options: [
    { value: "item1", label: "Item 1" },
    { value: "item2", label: "Item 2" },
    { value: "item3", label: "Item 3" },
  ],
  disabled: true,
};

export const CheckboxGroupWithError = GroupTemplate.bind({});
CheckboxGroupWithError.args = {
  label: "Select at least one",
  name: "mandatory",
  options: ["Option A", "Option B", "Option C"],
  error: "Please select at least one option",
};
