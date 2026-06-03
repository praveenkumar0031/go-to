import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { UploadCloud, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { bulkCreateUrls } from '../../api/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const BulkUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const bulkMutation = useMutation({
    mutationFn: bulkCreateUrls,
    onSuccess: () => {
      toast.success('Bulk links generated successfully!');
      handleClose();
      if (onUploadSuccess) onUploadSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to generate bulk links.');
    },
  });

  if (!isOpen) return null;

  const handleParseResult = (results) => {
    // Helper to validate and normalize URLs
    const validateAndNormalize = (urlString) => {
      if (!urlString || typeof urlString !== 'string') return null;
      
      let trimmed = urlString.trim();
      
      // 1. Strict Filtering: Skip header-like strings
      const lower = trimmed.toLowerCase();
      if (lower === 'url' || lower === 'originalurl') return null;
      if (trimmed === '') return null;

      // 2. Normalize: Prepend https:// if missing
      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = `https://${trimmed}`;
      }

      // 3. Strict Validation: Use new URL()
      try {
        new URL(trimmed);
        return { originalUrl: trimmed };
      } catch (e) {
        return null; // Invalid URL format
      }
    };

    // 1. Transform, Filter, and Validate
    const transformedData = results.data
      .map((row) => {
        // Handle various possible column names
        const rawUrl = row.url || row.Url || row.URL || row.originalUrl;
        return validateAndNormalize(rawUrl);
      })
      .filter(Boolean); // Filter out null results

    // 2. Payload Check
    if (transformedData.length === 0) {
      setError("No valid URLs found in the CSV. Please ensure the template has a 'url' column with valid web addresses.");
      toast.error("No valid URLs found in the CSV. Please check the template.");
      setParsedData([]);
    } else {
      setParsedData(transformedData);
      setError(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: handleParseResult,
      error: () => setError('Failed to parse CSV file.')
    });
  };

  const handleGenerate = () => {
    console.log("Upload triggered. File state:", file);
    
    // Check if data is ready
    if (parsedData.length === 0) {
      setError("Error: Could not find any valid URLs in the CSV. Make sure the column header is 'url'.");
      return;
    }

    // 3. Fix Payload Structure
    const payload = { urls: parsedData };

    // 4. Debug Logs
    console.log("Parsed Array Length:", parsedData.length);
    console.log("Final Payload being sent:", JSON.stringify(payload, null, 2));

    bulkMutation.mutate(payload);
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Bulk Upload</h3>
          <button onClick={handleClose} className={`p-1 rounded-md ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${isDark ? 'border-slate-700 hover:border-indigo-500' : 'border-slate-300 hover:border-indigo-500'}`}
          >
            <UploadCloud className="mx-auto mb-2 text-indigo-500" size={32} />
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              {file ? file.name : 'Click to select or drag CSV'}
            </p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
          
          {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
          
          {parsedData.length > 0 && (
            <p className="text-sm text-green-500">Ready to generate {parsedData.length} links.</p>
          )}
        </div>

        <div className={`p-4 border-t flex justify-end gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button onClick={handleClose} className={`px-4 py-2 rounded-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Cancel</button>
          <button 
            onClick={handleGenerate}
            disabled={parsedData.length === 0 || bulkMutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {bulkMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Generate Links
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;