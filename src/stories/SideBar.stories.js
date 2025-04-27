import React from 'react';
import { Sidebar } from '../components/SideBar';  // Adjust the path to your Sidebar component
import { Home, Settings, Users } from 'lucide-react';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

const items = [
  { id: 'home', label: 'Home', icon: 'home', permission: 'user' },
  { id: 'settings', label: 'Settings', icon: 'settings', permission: 'admin' },
  { id: 'users', label: 'Users', icon: 'users', permission: 'superadmin' },
];

export const Default = () => (
  <Sidebar
    items={items}
    isOpen={true}
    onToggle={() => {}}
    activeItem="home"
    onItemClick={() => {}}
    search={true}
    isCollapsible={true}
    header="Sidebar Header"
    footer="Sidebar Footer"
    customIcons={{
      home: Home,
      settings: Settings,
      users: Users,
    }}
    userRole="admin"
    behavior="docked"
  />
);

export const Collapsed = () => (
  <Sidebar
    items={items}
    isOpen={false}
    onToggle={() => {}}
    activeItem="settings"
    onItemClick={() => {}}
    search={true}
    isCollapsible={true}
    header="Collapsed Sidebar"
    footer="Collapsed Footer"
    customIcons={{
      home: Home,
      settings: Settings,
      users: Users,
    }}
    userRole="user"
    behavior="overlay"
  />
);

export const WithSearch = () => (
  <Sidebar
    items={items}
    isOpen={true}
    onToggle={() => {}}
    activeItem="users"
    onItemClick={() => {}}
    search={true}
    isCollapsible={false}
    header="Sidebar with Search"
    footer="Search Footer"
    customIcons={{
      home: Home,
      settings: Settings,
      users: Users,
    }}
    userRole="superadmin"
    behavior="pushed"
  />
);
