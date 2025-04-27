import React from 'react';
import { ChartCard } from '../components/ChartCard';
import { Line, Bar, Pie, Area } from 'recharts';

export default {
  title: 'Components/ChartCard',
  component: ChartCard,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    chartType: {
      control: {
        type: 'select',
        options: ['line', 'bar', 'pie', 'area', 'scatter']
      }
    },
    chartData: { control: 'object' },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    height: { control: 'number' },
    variant: {
      control: {
        type: 'select',
        options: ['elevated', 'flat', 'outlined']
      }
    },
    showLegend: { control: 'boolean' },
    tooltipContent: { control: 'text' },
    emptyState: { control: 'text' },
  }
};

const Template = (args) => <ChartCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Sales Overview',
  description: 'Chart displaying sales data',
  chartType: 'line',
  chartData: [
    { name: 'January', value: 400 },
    { name: 'February', value: 600 },
    { name: 'March', value: 800 },
    { name: 'April', value: 1000 },
  ],
  loading: false,
  height: 300,
  variant: 'elevated',
  showLegend: true,
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  ...Default.args,
  loading: true,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...Default.args,
  error: 'Failed to load chart data',
};

export const BarChartExample = Template.bind({});
BarChartExample.args = {
  title: 'Product Sales',
  chartType: 'bar',
  chartData: [
    { name: 'Product A', value: 300 },
    { name: 'Product B', value: 500 },
    { name: 'Product C', value: 700 },
  ],
  height: 400,
  variant: 'outlined',
  showLegend: true,
};

export const PieChartExample = Template.bind({});
PieChartExample.args = {
  title: 'Market Share',
  chartType: 'pie',
  chartData: [
    { name: 'Company A', value: 400 },
    { name: 'Company B', value: 600 },
  ],
  height: 300,
  variant: 'flat',
  showLegend: false,
};
