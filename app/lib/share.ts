import { FormData } from '../types';

// Compress JSON to base64 for URL
export const encodeFormData = (data: FormData): string => {
  try {
    const jsonString = JSON.stringify(data);
    // Use encodeURIComponent to handle special characters before base64
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Error encoding form data:', error);
    return '';
  }
};

// Decompress base64 from URL to JSON
export const decodeFormData = (encodedValue: string): FormData | null => {
  try {
    const jsonString = decodeURIComponent(atob(encodedValue));
    return JSON.parse(jsonString) as FormData;
  } catch (error) {
    console.error('Error decoding form data:', error);
    return null;
  }
};
