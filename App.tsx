import React, { useState } from 'react';
import { Uploader } from './components/Uploader';
import { ComparisonView } from './components/ComparisonView';
import { generateEtherealImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { AppState } from './types';
import { Wand2, AlertCircle } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Store the raw file to re-process if needed (not implemented in V1 but good practice)
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setAppState(AppState.PROCESSING);
      setError(null);
      setCurrentFile(file);
      
      // 1. Convert to base64 for display and API
      const base64 = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64}`;
      setOriginalImage(dataUrl);

      // 2. Call Gemini API
      const resultDataUrl = await generateEtherealImage(base64, file.type);
      
      setProcessedImage(resultDataUrl);
      setAppState(AppState.COMPLETE);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while processing your image.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setProcessedImage(null);
    setCurrentFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] opacity-50 mix-blend-screen animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-5xl flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col items-center mb-12 text-center animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-rose-200">
              AuraLens
            </h1>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto">
            Infuse your photos with delicate, cinematic sunlight and ethereal atmospheric glow using advanced Gemini AI.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center w-full">
          
          {appState === AppState.IDLE && (
            <Uploader onFileSelect={handleFileSelect} />
          )}

          {appState === AppState.PROCESSING && (
            <div className="text-center animate-fade-in flex flex-col items-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Weaving light...</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Applying ethereal filters, generating sunbeams, and polishing details. This may take a few seconds.
              </p>
            </div>
          )}

          {appState === AppState.COMPLETE && originalImage && processedImage && (
            <ComparisonView 
              originalUrl={originalImage} 
              processedUrl={processedImage} 
              onReset={handleReset} 
            />
          )}

          {appState === AppState.ERROR && (
            <div className="w-full max-w-md p-6 bg-slate-900/50 border border-red-500/20 rounded-2xl text-center animate-fade-in backdrop-blur-md">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Generation Failed</h3>
              <p className="text-slate-400 mb-6 text-sm break-words">{error}</p>
              
              {/* Add helpful hint for API Key errors */}
              {error?.includes("API Key") && (
                <div className="mb-6 text-xs text-indigo-300 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                  Tip: If running locally, ensure <code>process.env.API_KEY</code> is set in your environment or build configuration.
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={handleReset}>Try Another Photo</Button>
                {currentFile && (
                  <Button onClick={() => handleFileSelect(currentFile)}>Retry</Button>
                )}
              </div>
            </div>
          )}

        </main>

        <footer className="mt-12 text-center text-slate-600 text-sm py-4">
          <p>© {new Date().getFullYear()} AuraLens. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;