import { useState, useCallback } from 'react';
import { Upload, X, Image } from 'lucide-react';
import api from '../../lib/api';

export default function FileUpload({ onUpload, value, className = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PNG, JPG, or PDF files only');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreview(data.imageUrl);
      onUpload?.(data.imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    onUpload?.(null);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-sub">Evidence (Optional)</label>
      
      {preview ? (
        <div className="relative glass-card p-3">
          <div className="flex items-center gap-3">
            <Image size={20} className="text-primary-400" />
            <span className="text-sm text-heading truncate flex-1">{preview}</span>
            <button onClick={clearFile} className="btn-ghost btn-icon p-1 rounded-full">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-primary-500 bg-primary-500/5' 
              : 'border-surface-400/30 hover:border-surface-300/50'
            }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Upload size={32} className="text-surface-300" />
            )}
            <p className="text-sm text-sub">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted">PNG, JPG, PDF (max. 5MB)</p>
          </div>
        </div>
      )}
    </div>
  );
}
