import React from 'react';
import {LanguageSwitcher} from '../components/LanguageSwitcher'; // Adjust if path is different

export default {
  title: 'Components/LanguageSwitcher', // 👈 Storybook category/title
  component: LanguageSwitcher,           // 👈 Which component to render
};

export const Default = () => (
  <div className="p-6">
    <LanguageSwitcher />
  </div>
);
