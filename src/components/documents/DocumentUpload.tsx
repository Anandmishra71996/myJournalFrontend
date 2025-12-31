'use client';

import { useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { uploadDocument } = useDocumentStore();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      await uploadDocument(file);
      toast.success('Document uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      
      <p className="text-lg font-medium text-gray-900 mb-2">
        {uploading ? 'Uploading...' : 'Upload Document'}
      </p>
      
      <p className="text-sm text-gray-600 mb-4">
        Drag and drop or click to browse
      </p>
      
      <label className="inline-block">
        <input
          type="file"
          className="hidden"
          accept=".pdf,.txt,.docx"
          onChange={handleChange}
          disabled={uploading}
        />
        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
          Select File
        </span>
      </label>
      
      <p className="text-xs text-gray-500 mt-4">
        Supported formats: PDF, TXT, DOCX (Max 10MB)
      </p>
    </div>
  );
}
