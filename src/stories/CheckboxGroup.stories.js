import { CheckboxGroup } from "../components/Checkbox"; // same file as Checkbox if you exported both

export default {
  title: "Form_Element/CheckboxGroup",
  component: CheckboxGroup,
};

export const Default = (args) => <CheckboxGroup {...args} />;

Default.args = {
  label: "Select Interests",
  name: "interests",
  value: [], // initially no selection
  options: [
    { value: "tech", label: "Technology" },
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
    { value: "reading", label: "Reading" },
  ],
  inline: true, // optional: show them side-by-side
};
