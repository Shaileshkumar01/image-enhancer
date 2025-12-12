import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { validateFile } from '../utils/imageUtils';
import { MAX_FILE_SIZE_MB, SUPPORTED_MIME_TYPES } from '../constants';

interface UploaderProps {
  onFileSelect: (file: File) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file, MAX_FILE_SIZE_MB, SUPPORTED_MIME_TYPES);
    if (validationError) {
      setError(validationError);
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div 
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300
          ${isDragOver 
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' 
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30 bg-slate-900/30'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full"></div>
            <div className="relative bg-gradient-to-tr from-indigo-500 to-purple-500 p-4 rounded-full shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Upload your photo</h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Drag & drop or click to browse. Supports JPG, PNG, WEBP up to {MAX_FILE_SIZE_MB}MB.
          </p>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={SUPPORTED_MIME_TYPES.join(',')}
            className="hidden" 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group relative px-8 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Select Photo
            </span>
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm text-center animate-fade-in">
          {error}
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
          <Sparkles className="w-6 h-6 text-indigo-400 mb-2" />
          <h4 className="font-semibold text-slate-200">Ethereal Glow</h4>
          <p className="text-xs text-slate-400 mt-1">Soft, dreamy diffusion for a heavenly look.</p>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
          <svg className="w-6 h-6 text-amber-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <h4 className="font-semibold text-slate-200">Sunlit Warmth</h4>
          <p className="text-xs text-slate-400 mt-1">Cinematic sunbeams and golden highlights.</p>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
          <svg className="w-6 h-6 text-pink-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10"></path><path d="M12 12 2.1 12.05"></path></svg>
          <h4 className="font-semibold text-slate-200">Detail Keeper</h4>
          <p className="text-xs text-slate-400 mt-1">Preserves facial features with high fidelity.</p>
        </div>
      </div>
    </div>
  );
};