import React from "react";
import { Accordion } from "../components/Accordion"; // adjust your import path!

export default {
  title: "Components/Accordion",
  component: Accordion,
};

const items = [
  {
    title: "What is your return policy?",
    content:
      "You can return any item within 30 days of purchase. No questions asked.",
  },
  {
    title: "Do you offer technical support?",
    content: "Yes, we offer 24/7 technical support for all our products.",
  },
  {
    title: "Can I change my subscription plan later?",
    content: "Absolutely! You can upgrade or downgrade your plan anytime.",
  },
];

export const Default = (args) => <Accordion {...args} />;

Default.args = {
  items,
  allowMultiple: false, // only one open at a time
  defaultOpen: [],
};

export const AllowMultipleOpen = (args) => <Accordion {...args} />;

AllowMultipleOpen.args = {
  items,
  allowMultiple: true, // multiple can open
  defaultOpen: [0], // first item open by default
};
