import React from "react";
import {Tabs} from "../components/Tabs"; // ✅ correct import

export default {
  title: 'Components/Tabs',
  component: Tabs,
};

const dummyTabs = [
  {
    label: "Home",
    content: <div>Welcome to Home Tab</div>,
  },
  {
    label: "Profile",
    content: <div>This is your Profile</div>,
  },
  {
    label: "Settings",
    content: <div>Adjust your Settings here</div>,
  }
];

export const Default = () => (
  <Tabs 
    tabs={dummyTabs}
    defaultActiveTab={0} // optional
  />
);
