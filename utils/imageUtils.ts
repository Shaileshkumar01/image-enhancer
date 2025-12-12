export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validateFile = (file: File, maxMb: number, supportedTypes: string[]): string | null => {
  if (!supportedTypes.includes(file.type)) {
    return `Unsupported file type. Please upload ${supportedTypes.map(t => t.split('/')[1]).join(', ')}.`;
  }
  
  if (file.size > maxMb * 1024 * 1024) {
    return `File size exceeds ${maxMb}MB limit.`;
  }

  return null;
};
