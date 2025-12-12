import React, { useState, useRef, useEffect } from 'react';
import { Columns, Download, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface ComparisonViewProps {
  originalUrl: string;
  processedUrl: string;
  onReset: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, processedUrl, onReset }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsResizing(true);
  
  const handleMouseUp = () => setIsResizing(false);
  
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove as any);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
    };
  }, [isResizing]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `auralens-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/30">
          <div className="flex items-center gap-2">
            <Columns className="w-5 h-5 text-indigo-400" />
            <h2 className="font-semibold text-slate-200">Result Comparison</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onReset} className="!py-2 !px-3 text-sm">
              <RefreshCcw className="w-4 h-4 mr-2" />
              New
            </Button>
            <Button onClick={handleDownload} className="!py-2 !px-3 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Comparison Area */}
        <div className="relative w-full aspect-[4/5] md:aspect-video bg-black/40 overflow-hidden select-none group border border-transparent hover:border-indigo-400/30 transition-all duration-300"
             ref={containerRef}
             onMouseDown={handleMouseDown}
             onTouchStart={() => setIsResizing(true)}
        >
          {/* Underlying Processed Image (Right Side) */}
          <img 
            src={processedUrl} 
            alt="Processed" 
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Overlying Original Image (Left Side) - Clipped */}
          <div 
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-indigo-500 bg-black/40"
            style={{ width: `${sliderPosition}%` }}
          >
            <img 
              src={originalUrl} 
              alt="Original" 
              className="absolute top-0 left-0 h-full max-w-none object-contain pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            />
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-10 -ml-5 cursor-ew-resize flex items-center justify-center group/slider z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-1 h-full bg-transparent group-hover/slider:bg-indigo-500/20 transition-colors" />
            <div className="w-8 h-8 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] flex items-center justify-center border-2 border-white absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white -ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
            Original
          </div>
          <div className="absolute bottom-4 right-4 bg-indigo-600/80 backdrop-blur text-white text-xs px-2 py-1 rounded pointer-events-none shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-opacity duration-300 group-hover:opacity-0">
            AuraLens
          </div>
        </div>
        
        <div className="p-4 bg-slate-900/30 text-center text-sm text-slate-400">
          Drag the slider to see the difference
        </div>
      </div>
    </div>
  );
};