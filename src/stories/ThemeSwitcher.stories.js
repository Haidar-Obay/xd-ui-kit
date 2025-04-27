import React, { useState } from 'react';
import { ThemeSwitcher } from '../components/ThemeSwitcher'; // Adjust the path if needed

export default {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
};

export const Default = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeSwitcher
      theme={theme}
      onToggle={toggleTheme}
      showLabel={false}
    />
  );
};
