// Toast.stories.jsx
import React, { useContext } from 'react';
import { ToastProvider, ToastContext } from '../components/Toast'; // Adjust path if needed

export default {
  title: 'Components/Toast',
  component: ToastProvider,
};

// Story to wrap ToastTester inside ToastProvider
export const Default = () => (
  <ToastProvider>
    <ToastTester />
  </ToastProvider>
);

// Separate helper component that uses ToastContext
const ToastTester = () => {
  const { toast } = useContext(ToastContext);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Tester</h2>

      <div className="flex flex-wrap gap-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => toast.success('This is a success message!')}
        >
          Show Success Toast
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => toast.error('This is an error message!')}
        >
          Show Error Toast
        </button>

        <button
          className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
          onClick={() => toast.warning('This is a warning message!')}
        >
          Show Warning Toast
        </button>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => toast.info('This is an info message!')}
        >
          Show Info Toast
        </button>

        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          onClick={() => {
            const loadingToast = toast.loading('Loading...');
            setTimeout(() => {
              loadingToast.success('Loaded successfully!');
            }, 2000);
          }}
        >
          Show Loading then Success
        </button>

        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          onClick={() =>
            toast.show({
              title: 'Custom Toast',
              message: 'This is a custom notification with a long description!',
              type: 'notification',
              duration: 6000,
            })
          }
        >
          Show Custom Toast
        </button>
      </div>
    </div>
  );
};
