import React, { useState } from 'react';
import {Modal} from '../components/Modal'; // Adjust the path to where your Modal is located

export default {
  title: 'Components/Modal',
  component: Modal,
};

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <button onClick={handleOpen} className="p-2 text-white bg-blue-500 rounded">
        Open Modal
      </button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={handleClose}
        onAnimationComplete={() => console.log('Animation complete')}
      >
        <p>This is the modal content.</p>
      </Modal>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Default Modal',
  size: 'md',
  footer: <button onClick={() => alert('Clicked!')} className="px-4 py-2 text-white bg-blue-500 rounded">Save</button>,
};

export const FullScreen = Template.bind({});
FullScreen.args = {
  title: 'Full Screen Modal',
  size: 'full',
  fullScreenButton: true,
  footer: <button onClick={() => alert('Clicked!')} className="px-4 py-2 text-white bg-blue-500 rounded">Save</button>,
};
