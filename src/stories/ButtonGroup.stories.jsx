import React from 'react';
import { ButtonGroup } from '../components/Button'; // Adjust path
import { Button } from '../components/Button'; // Basic Button used inside group

export default {
  title: 'Button/ButtonGroup',
  component: ButtonGroup,
};

export const Default = (args) => (
  <ButtonGroup {...args}>
    <Button>Left</Button>
    <Button>Middle</Button>
    <Button>Right</Button>
  </ButtonGroup>
);

Default.args = {
  vertical: false, // Horizontal group by default
};

export const Vertical = (args) => (
  <ButtonGroup vertical {...args}>
    <Button>Top</Button>
    <Button>Center</Button>
    <Button>Bottom</Button>
  </ButtonGroup>
);

Vertical.args = {
  vertical: true, // Vertical group
};
