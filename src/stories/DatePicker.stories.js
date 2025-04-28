import React, { useState } from "react";
import { DatePicker } from "../components/DatePicker"; // Adjust path if needed

export default {
  title: "Components/DatePicker",
  component: DatePicker,
  argTypes: {
    format: {
      control: { type: "text" },
      description: "Date display format",
      defaultValue: "MM/DD/YYYY",
    },
    theme: {
      control: { type: "select", options: ["light", "dark"] },
    },
    locale: {
      control: { type: "text" },
    },
    showTimeSelect: {
      control: "boolean",
    },
    isClearable: {
      control: "boolean",
    },
    todayButton: {
      control: "boolean",
    },
  },
};

const Template = (args) => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="max-w-xs">
      <DatePicker
        {...args}
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
    </div>
  );
};

// --- Stories ---

export const Basic = Template.bind({});
Basic.args = {
  label: "Pick a Date",
  placeholder: "Select a date...",
};

export const WithTimeSelection = Template.bind({});
WithTimeSelection.args = {
  label: "Date & Time",
  placeholder: "Select date and time...",
  showTimeSelect: true,
};

export const PreSelectedDate = Template.bind({});
PreSelectedDate.args = {
  label: "Starting Date",
  placeholder: "Select a date...",
  value: new Date().toISOString(),
};

export const DisabledDatePicker = Template.bind({});
DisabledDatePicker.args = {
  label: "Disabled",
  disabled: true,
  placeholder: "Can't select",
};

export const WithMinMaxDates = Template.bind({});
WithMinMaxDates.args = {
  label: "Limited Date Range",
  minDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 days ago
  maxDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), // 5 days later
};

export const WithClearButton = Template.bind({});
WithClearButton.args = {
  label: "Clearable Picker",
  isClearable: true,
  placeholder: "Pick or clear",
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  label: "Error Example",
  error: "You must pick a valid date",
};
