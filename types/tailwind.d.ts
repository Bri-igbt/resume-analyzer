// tailwind.d.ts
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add Tailwind-specific class names that might be flagged as unknown
    className?: string;
    // Add other custom attributes if needed
  }
}