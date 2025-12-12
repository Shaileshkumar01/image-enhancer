export interface ProcessedImageResult {
  originalUrl: string;
  processedUrl: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ProcessingError {
  message: string;
  details?: string;
}