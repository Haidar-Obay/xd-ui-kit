import React from "react";
import { FileUploader } from "../components/FileUpload";

export default {
  title: 'App/FileUploader', // how it shows in Storybook sidebar
  component: FileUploader,
  args: {
    dropzoneText: "Drag & drop your files here or click to upload",
    multiple: true,
    showProgressBar: true,
    previewType: "thumbnail",
    maxSizeMB: 5,
    accept: "image/*,application/pdf",
    autoUpload: false,
    uploadText: "Upload Files",
  },
};

const Template = (args) => <FileUploader {...args} />;

export const Default = Template.bind({});
Default.args = {};