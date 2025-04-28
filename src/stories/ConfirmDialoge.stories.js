import React from "react";
import {
  ConfirmDialogProvider,
  useConfirmDialog,
} from "../components/ConfirmDialogue"; // Adjust path if needed (you had "ConfirmDialoge" typo)

export default {
  title: "Components/ConfirmDialogue",
  component: ConfirmDialogProvider,
  parameters: {
    layout: "centered",
  },
};

const DemoButton = (props) => {
  const { confirm } = useConfirmDialog();

  const handleClick = async () => {
    const result = await confirm(props);
    alert(result ? "✅ Confirmed!" : "❌ Cancelled!");
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
    >
      Open Confirm Dialog
    </button>
  );
};

const Template = (args) => (
  <ConfirmDialogProvider>
    <DemoButton {...args} />
  </ConfirmDialogProvider>
);

// --- Stories ---

export const Basic = Template.bind({});
Basic.args = {
  title: "Delete Item",
  message: "Are you sure you want to delete this item?",
  confirmText: "Delete",
  cancelText: "Cancel",
  type: "warning",
};

export const DangerDialog = Template.bind({});
DangerDialog.args = {
  title: "Permanently Delete?",
  message: "This action cannot be undone!",
  confirmText: "Yes, delete it",
  cancelText: "No",
  type: "danger",
};

export const SuccessDialog = Template.bind({});
SuccessDialog.args = {
  title: "Operation Successful",
  message: "Your data was saved successfully!",
  confirmText: "OK",
  hideCancel: true,
  type: "success",
};

export const InfoDialog = Template.bind({});
InfoDialog.args = {
  title: "Information",
  message: "This is an informational popup.",
  type: "info",
};

export const CustomContentDialog = Template.bind({});
CustomContentDialog.args = {
  title: "Custom Content",
  customContent: (
    <div className="text-sm text-gray-600">
      <p>This is a custom message body.</p>
      <ul className="list-disc ml-4 mt-2">
        <li>Custom bullet 1</li>
        <li>Custom bullet 2</li>
        <li>Custom bullet 3</li>
      </ul>
    </div>
  ),
  confirmText: "Got it",
  cancelText: "Dismiss",
};

export const TopPositionDialog = Template.bind({});
TopPositionDialog.args = {
  title: "Alert!",
  message: "This dialog appears near the top.",
  position: "top",
  type: "warning",
};

export const BigDialog = Template.bind({});
BigDialog.args = {
  title: "Large Dialog",
  message: "This is a large dialog with more space.",
  size: "lg",
  type: "question",
};

export const CloseOnOverlayClickDisabled = Template.bind({});
CloseOnOverlayClickDisabled.args = {
  title: "Strict Confirmation",
  message: "You must choose Confirm or Cancel.",
  closeOnOverlayClick: false,
  type: "danger",
};
