import React, { useState } from "react";
import { Modal } from "../components/Modal"; // Adjust path if needed

export default {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "full"],
    },
    position: {
      control: { type: "select" },
      options: ["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"],
    },
    animation: {
      control: { type: "select" },
      options: ["fade", "zoom", "slide-up", "slide-down", "slide-left", "slide-right", "rotate", "flip", "bounce", "swing"],
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "system"],
    },
    backdropColor: {
      control: { type: "select" },
      options: ["dark", "light", "transparent"],
    },
    backdropFilter: {
      control: { type: "select" },
      options: ["none", "blur", "grayscale", "invert", "sepia"],
    },
  },
};

const Template = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
      >
        Open Modal
      </button>
      <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Hello from Modal!</h2>
          <p className="text-gray-600 mb-6">
            This is a beautiful, customizable, draggable, and resizable modal.
          </p>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
          >
            Close Modal
          </button>
        </div>
      </Modal>
    </>
  );
};

// --- Stories ---

export const Basic = Template.bind({});
Basic.args = {
  title: "Basic Modal",
};

export const DraggableResizable = Template.bind({});
DraggableResizable.args = {
  title: "Draggable & Resizable Modal",
  draggable: true,
  resizable: true,
  fullScreenButton: true,
};

export const AnimatedModal = Template.bind({});
AnimatedModal.args = {
  title: "Animated Modal",
  animation: "zoom",
  duration: 400,
};

export const TopPositionModal = Template.bind({});
TopPositionModal.args = {
  title: "Top Modal",
  position: "top",
};

export const DarkThemeModal = Template.bind({});
DarkThemeModal.args = {
  title: "Dark Themed Modal",
  theme: "dark",
};

export const BlurBackdrop = Template.bind({});
BlurBackdrop.args = {
  title: "Blurred Backdrop Modal",
  backdropFilter: "blur",
};

export const FullScreenModal = Template.bind({});
FullScreenModal.args = {
  title: "Full Screen Modal",
  fullScreenButton: true,
};

export const CustomSize = Template.bind({});
CustomSize.args = {
  title: "Custom Width and Height",
  width: "500px",
  height: "400px",
};

export const NoCloseOnOverlayClick = Template.bind({});
NoCloseOnOverlayClick.args = {
  title: "Can't Close by Clicking Outside",
  closeOnOverlayClick: false,
};
