import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle, Image as ImageIcon, FileText, Music, Video, Archive, Code } from 'lucide-react';

export const FileUploader = ({
  accept = "*/*",
  multiple = false,
  maxSize = 5242880, // 5MB default
  maxFiles = 10,
  minFiles = 0,
  onUpload = () => {},
  onDelete = () => {},
  onError = () => {},
  className = "",
  dropzoneText = "Drag and drop files here or click to browse",
  uploadText = "Upload",
  disabled = false,
  showPreview = true,
  showProgressBar = true,
  autoUpload = false,
  theme = "default", // 'default', 'minimal', 'card'
  previewType = "thumbnail", // 'thumbnail', 'list', 'grid'
  allowedTypes = [], // e.g. ['image/jpeg', 'image/png']
  validateFile = null, // custom validation function
  createUploadFn = null, // custom upload function
  horizontal = false,
  capture = null, // 'user', 'environment', null
  loadingText = "Uploading..."
})=> {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  // Reset errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Generate a unique ID for each file
  const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    event.preventDefault();
    const selectedFiles = event.target?.files || event.dataTransfer?.files || [];
    
    if (selectedFiles.length === 0) return;
    
    // Check if max files limit would be exceeded
    if (multiple && selectedFiles.length + files.length > maxFiles) {
      addError(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }

    // Process each file
    Array.from(selectedFiles).forEach(file => {
      processFile(file);
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process a single file
  const processFile = (file) => {
    // Create a file object with additional properties
    const fileObj = {
      id: generateUniqueId(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending', // 'pending', 'uploading', 'success', 'error'
      error: null,
      preview: null
    };

    // Validate file
    const validationError = validateFileInternal(file);
    if (validationError) {
      addError(validationError);
      fileObj.status = 'error';
      fileObj.error = validationError;
      
      // If we're still showing error files in the list
      setFiles(prevFiles => multiple ? [...prevFiles, fileObj] : [fileObj]);
      return;
    }

    // Generate preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileObj.preview = e.target.result;
        updateFile(fileObj);
        
        // Auto upload if enabled
        if (autoUpload) {
          uploadFile(fileObj);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, set a placeholder preview
      fileObj.preview = null;
      
      // Add file to the list
      setFiles(prevFiles => multiple ? [...prevFiles, fileObj] : [fileObj]);
      
      // Auto upload if enabled
      if (autoUpload) {
        uploadFile(fileObj);
      }
    }
  };

  // Internal file validation
  const validateFileInternal = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    
    // Check file type if allowedTypes is provided
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    
    // Custom validation if provided
    if (validateFile && typeof validateFile === 'function') {
      const customError = validateFile(file);
      if (customError) return customError;
    }
    
    return null;
  };

  // Format file size in a human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload a file
  const uploadFile = async (fileObj) => {
    // Find the file in the state
    const existingFile = files.find(f => f.id === fileObj.id);
    if (!existingFile || existingFile.status === 'success') return;
    
    // Update status to uploading
    updateFile({
      ...existingFile,
      status: 'uploading',
      progress: 0
    });

    try {
      if (createUploadFn && typeof createUploadFn === 'function') {
        // Use custom upload function if provided
        await simulateCustomUpload(fileObj);
      } else {
        // Default upload simulation with progress
        await simulateDefaultUpload(fileObj);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      updateFile({
        ...fileObj,
        status: 'error',
        error: 'Upload failed',
        progress: 0
      });
      addError(`Failed to upload ${fileObj.name}: ${error.message || 'Unknown error'}`);
      onError({ file: fileObj, error });
    }
  };

  // Simulate default upload with progress
  const simulateDefaultUpload = async (fileObj) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        updateFile({
          ...fileObj,
          progress
        });
        
        if (progress >= 100) {
          clearInterval(interval);
          updateFile({
            ...fileObj,
            status: 'success',
            progress: 100
          });
          onUpload(fileObj);
          resolve();
        }
      }, 300);
    });
  };

  // Simulate custom upload with the provided function
  const simulateCustomUpload = async (fileObj) => {
    try {
      const uploadFn = createUploadFn(fileObj.file);
      
      if (uploadFn && typeof uploadFn.then === 'function') {
        // Handle promises with progress if available
        if (uploadFn.progress) {
          uploadFn.progress((progress) => {
            updateFile({
              ...fileObj,
              progress: Math.round(progress)
            });
          });
        }
        
        await uploadFn;
        updateFile({
          ...fileObj,
          status: 'success',
          progress: 100
        });
        onUpload(fileObj);
      } else {
        // Handle non-promise returns
        updateFile({
          ...fileObj,
          status: 'success',
          progress: 100
        });
        onUpload(fileObj);
      }
    } catch (error) {
      throw error;
    }
  };

  // Update a file in the state
  const updateFile = (updatedFile) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === updatedFile.id ? updatedFile : file
      )
    );
  };

  // Delete a file
  const deleteFile = (fileId) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    onDelete(fileId);
  };

  // Add an error message
  const addError = (message) => {
    setErrors(prev => [...prev, { id: generateUniqueId(), message }]);
    if (onError) onError({ message });
  };

  // Remove an error message
  const removeError = (errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  };

  // Drag and drop event handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFileSelect(e);
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon size={24} />;
    if (fileType.startsWith('text/')) return <FileText size={24} />;
    if (fileType.startsWith('audio/')) return <Music size={24} />;
    if (fileType.startsWith('video/')) return <Video size={24} />;
    if (fileType.startsWith('application/zip') || fileType.startsWith('application/x-rar')) return <Archive size={24} />;
    if (fileType.startsWith('application/json') || fileType.includes('code')) return <Code size={24} />;
    return <File size={24} />;
  };

  // Handle the upload button click
  const handleUploadClick = () => {
    files.forEach(file => {
      if (file.status === 'pending') {
        uploadFile(file);
      }
    });
  };

  // Apply theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'minimal':
        return 'border border-dashed border-gray-300 rounded-md p-4 bg-gray-50';
      case 'card':
        return 'border border-gray-200 rounded-lg shadow-sm p-6 bg-white';
      case 'default':
      default:
        return 'border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 hover:bg-blue-100 transition-colors';
    }
  };

  // Get preview component based on previewType
  const renderPreview = () => {
    if (!showPreview || files.length === 0) return null;

    switch (previewType) {
      case 'list':
        return (
          <div className="mt-4 space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-white border rounded-md">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate" style={{ maxWidth: '200px' }}>{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'success' && <CheckCircle size={18} className="text-green-500" />}
                  {file.status === 'error' && <AlertCircle size={18} className="text-red-500" title={file.error} />}
                  
                  {showProgressBar && file.status === 'uploading' && (
                    <div className="w-16 h-1 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="h-full transition-all duration-300 ease-out bg-blue-500"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => deleteFile(file.id)}
                    className="p-1 text-gray-400 rounded-full hover:text-red-500 hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map(file => (
              <div key={file.id} className="relative group">
                <div className="flex items-center justify-center overflow-hidden border rounded-md bg-gray-50 aspect-square">
                  {file.type.startsWith('image/') && file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      {getFileIcon(file.type)}
                      <p className="w-full mt-2 text-xs text-center truncate" style={{ maxWidth: '100%' }}>{file.name}</p>
                    </div>
                  )}
                  
                  {showProgressBar && file.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full transition-all duration-300 ease-out bg-blue-500"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  <div className="absolute transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => deleteFile(file.id)}
                      className="p-1 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {file.status === 'success' && (
                    <div className="absolute bottom-1 right-1">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                  )}
                  
                  {file.status === 'error' && (
                    <div className="absolute bottom-1 right-1" title={file.error}>
                      <AlertCircle size={18} className="text-red-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'thumbnail':
      default:
        return (
          <div className="flex flex-wrap gap-4 mt-4">
            {files.map(file => (
              <div key={file.id} className="relative">
                <div className="flex items-center justify-center w-20 h-20 overflow-hidden border rounded-md bg-gray-50">
                  {file.type.startsWith('image/') && file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  
                  {showProgressBar && file.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full transition-all duration-300 ease-out bg-blue-500"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => deleteFile(file.id)}
                  className="absolute p-1 text-gray-500 bg-white border rounded-full shadow-sm -top-2 -right-2 hover:text-red-500"
                >
                  <X size={14} />
                </button>
                
                {file.status === 'success' && (
                  <div className="absolute -bottom-2 -right-2">
                    <CheckCircle size={16} className="text-green-500 bg-white rounded-full" />
                  </div>
                )}
                
                {file.status === 'error' && (
                  <div className="absolute -bottom-2 -right-2" title={file.error}>
                    <AlertCircle size={16} className="text-red-500 bg-white rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`file-uploader ${horizontal ? 'flex flex-row gap-4 items-start' : 'flex flex-col'} ${className}`}>
      {/* Dropzone */}
      <div 
        ref={dropzoneRef}
        className={`dropzone ${getThemeClasses()} ${isDragging ? 'ring-2 ring-blue-400' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} flex flex-col items-center justify-center text-center ${horizontal ? 'flex-1' : 'w-full'}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-10 h-10 mb-2 text-blue-500" />
        <p className="text-sm font-medium text-gray-700">{dropzoneText}</p>
        <p className="mt-1 text-xs text-gray-500">
          {allowedTypes.length > 0 
            ? `Allowed: ${allowedTypes.map(t => t.replace('image/', '').toUpperCase()).join(', ')}`
            : 'All file types supported'}
          {maxSize && ` (Max: ${formatFileSize(maxSize)})`}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          capture={capture}
        />
      </div>

      {/* Preview and Actions */}
      <div className={`${horizontal ? 'flex-1' : 'w-full'}`}>
        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mt-4">
            {errors.map(error => (
              <div 
                key={error.id} 
                className="flex items-center justify-between px-4 py-2 mb-2 text-red-800 rounded-md bg-red-50"
              >
                <div className="flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  <span className="text-sm">{error.message}</span>
                </div>
                <button 
                  onClick={() => removeError(error.id)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Preview */}
        {renderPreview()}

        {/* Upload button for non-auto upload */}
        {!autoUpload && files.some(file => file.status === 'pending') && (
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={disabled}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {files.some(file => file.status === 'uploading') ? loadingText : uploadText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
