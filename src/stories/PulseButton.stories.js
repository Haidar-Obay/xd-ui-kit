import React from 'react';
import { PulseButton } from '../components/Button'; // Adjust path

export default {
  title: 'Button/PulseButton',
  component: PulseButton,
};

export const Default = (args) => <PulseButton {...args}>Pulse Button</PulseButton>;

Default.args = {
  // You can add props here if needed
};
