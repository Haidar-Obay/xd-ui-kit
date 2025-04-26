// Card.stories.jsx

import React from 'react';
import { Card } from '../components/Card'; // Adjust the import based on your folder structure

export default {
  title: 'Components/Card',
  component: Card,  
  args: {
    title: 'Sample Title',
    subtitle: 'Sample Subtitle',
    description: 'This is a description for the card.',
    hoverable: true,
    padding: 'md',
    elevation: 'md',
    width: '300px',
  },
};

export const Default = (args) => <Card {...args} />;

export const WithImage = (args) => (
  <Card
    {...args}
    image="https://via.placeholder.com/300x200"
    imagePosition="top"
  />
);

export const Horizontal = (args) => (
  <Card
    {...args}
    variant="horizontal"
    image="https://via.placeholder.com/300x200"
    imagePosition="left"
  />
);

export const Compact = (args) => (
  <Card
    {...args}
    variant="compact"
    image="https://via.placeholder.com/40"
  />
);

export const Profile = (args) => (
  <Card
    {...args}
    variant="profile"
    image="https://via.placeholder.com/100"
    tags={['Developer', 'Designer']}
  />
);

export const Loading = (args) => <Card {...args} loading={true} />;
