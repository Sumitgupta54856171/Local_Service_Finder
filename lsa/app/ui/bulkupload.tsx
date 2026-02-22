import {useState, useRef} from 'react';
import axios from 'axios';
import { UploadCloud, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';


export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  // Handle File Input Selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // Validate File Type (Only CSV)
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check if file is CSV
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setErrorMessage('Please upload a valid .csv file only.');
      setUploadStatus('error');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  // Clear Selected File
  const clearFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Form Submit (Real Upload)
  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post('http://localhost:8000/api/service/bulkupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setUploadStatus('success');
      // Reset form after showing success message for 3 seconds
      setTimeout(() => {
        clearFile();
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to upload file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start pt-12 font-sans">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bulk Upload</h1>
          <p className="text-slate-500 text-sm">Upload a CSV file to add multiple service locations at once.</p>
        </div>

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="mx-8 mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Data successfully uploaded and processed!
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            {errorMessage}
          </div>
        )}

        {/* Upload Area */}
        <div className="px-8 pb-8">
          
          {/* Drag & Drop Zone */}
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-2 border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv, text/csv"
                className="hidden" 
              />
              <div className="p-4 bg-white rounded-full shadow-sm mb-4 border border-slate-100">
                <UploadCloud className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-slate-800 text-base font-semibold mb-1">
                Click to upload or drag and drop
              </h3>
              <p className="text-slate-500 text-sm">
                CSV files only (max. 5MB)
              </p>
            </div>
          ) : (
            /* Selected File Preview */
            <div className="mt-2 border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-slate-900 font-medium text-sm truncate w-48 sm:w-64">
                    {file.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button 
                onClick={clearFile}
                disabled={uploadStatus === 'uploading'}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-8 mt-6 flex items-center justify-end gap-4 border-t border-slate-200">
            <button 
              type="button" 
              onClick={clearFile}
              disabled={uploadStatus === 'uploading' || !file}
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading' || !file}
              className="flex items-center justify-center h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {uploadStatus === 'uploading' ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                'Upload Data'
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}