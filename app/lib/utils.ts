import {twMerge} from "tailwind-merge";
import clsx, {type ClassValue} from "clsx";

/**
 * Formats a file size in bytes to a human-readable string (KB, MB, GB)
 * @param bytes - The file size in bytes
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns A formatted string representing the file size
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  // Determine the appropriate unit by calculating the log
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Calculate the value in the appropriate unit
  const value = bytes / Math.pow(k, i);
  
  // Format the value with the specified number of decimal places
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`;
}

export  const generateUUID= () => crypto.randomUUID()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}