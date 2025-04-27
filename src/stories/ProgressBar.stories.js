import React from 'react';
import { ProgressBar } from '../components/ProgressBar';

export default {
  title: 'Components/ProgressBar', // how it shows in Storybook sidebar
  component: ProgressBar,
  argTypes: {
    progress: { control: { type: 'number', min: 0, max: 100 } },
    total: { control: { type: 'number' } },
    height: { control: { type: 'number' } },
    barColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    borderRadius: { control: { type: 'number' } },
    transitionDuration: { control: { type: 'number' } },
    striped: { control: 'boolean' },
    animated: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    labelPosition: { control: { type: 'select', options: ['top', 'inside', 'bottom'] } },
    showPercentage: { control: 'boolean' },
    autoCalculatePercentage: { control: 'boolean' },
    showStatus: { control: 'boolean' },
    status: { control: { type: 'select', options: ['normal', 'success', 'error', 'warning'] } },
    statusIcon: { control: 'boolean' },
    boxShadow: { control: 'boolean' },
  },
};

const Template = (args) => <ProgressBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  progress: 40,
  total: 100,
  label: 'Progress',
  striped: false,
  animated: false,
  indeterminate: false,
  showPercentage: true,
  autoCalculatePercentage: true,
  height: 20,
  barColor: '#3b82f6',
  backgroundColor: '#e5e7eb',
  borderRadius: 8,
  transitionDuration: 300,
  labelPosition: 'top',
  showStatus: false,
  status: 'normal',
  statusIcon: true,
  boxShadow: false,
};
