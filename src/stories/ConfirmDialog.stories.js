// src/stories/ConfirmDialog.stories.jsx
import React from 'react';
import { ConfirmDialogProvider, useConfirmDialog } from '../components/ConfirmDialogue';

export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialogProvider,
  decorators: [
    (Story) => <ConfirmDialogProvider><Story/></ConfirmDialogProvider>
  ],
};

// A small component that triggers the confirm dialog
function ConfirmDemo() {
  const { confirm } = useConfirmDialog();

  const handleClick = async () => {
    const result = await confirm({
      title: 'Delete item',
      message: 'Are you sure you want to delete this item?'
    });
    console.log('User choice:', result);
  };

  return <button onClick={handleClick}>Open Confirm Dialog</button>;
}

export const Default = () => <ConfirmDemo />;
