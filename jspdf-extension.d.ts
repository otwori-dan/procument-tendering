// jspdf-extension.d.ts

import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }

  interface AutoTableOptions {
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    styles?: object;
    startY?: number;
  }
}
