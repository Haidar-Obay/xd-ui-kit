import React, { useState } from "react";
import { LanguageSwitcher } from "../components/LanguageSwitcher"; // Adjust path if needed

export default {
  title: "Components/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    position: {
      control: { type: "select" },
      options: ["bottom-left", "bottom-right", "top-left", "top-right"],
    },
    darkMode: { control: "boolean" },
    compact: { control: "boolean" },
    showLocalNames: { control: "boolean" },
  },
};

const Template = (args) => {
  const [language, setLanguage] = useState(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <LanguageSwitcher {...args} onChange={(lang) => setLanguage(lang)} />

      {language && (
        <div className="text-center text-sm text-gray-700 dark:text-gray-300">
          Selected: <strong>{language.name}</strong> ({language.code})
        </div>
      )}
    </div>
  );
};

// --- Stories ---

export const Basic = Template.bind({});
Basic.args = {};

export const CompactMode = Template.bind({});
CompactMode.args = {
  compact: true,
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  darkMode: true,
};

export const TopLeftPosition = Template.bind({});
TopLeftPosition.args = {
  position: "top-left",
};

export const TopRightPosition = Template.bind({});
TopRightPosition.args = {
  position: "top-right",
};

export const BottomRightPosition = Template.bind({});
BottomRightPosition.args = {
  position: "bottom-right",
};

export const WithoutLocalNames = Template.bind({});
WithoutLocalNames.args = {
  showLocalNames: false,
};
