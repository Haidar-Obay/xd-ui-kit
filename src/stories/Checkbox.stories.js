import { Checkbox } from "../components/Checkbox"; // adjust path if needed

export default {
  title: "Form_Element/Checkbox",
  component: Checkbox,
};

export const Default = (args) => <Checkbox {...args} />;

Default.args = {
  label: "Accept Terms and Conditions",
  checked: false,
};
