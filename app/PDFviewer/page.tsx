// PDFViewer.tsx
"use client"
import React, { useState, ChangeEvent } from 'react';
import { blobToURL } from '../../lib/utils';

const PDFViewer: React.FC = () => {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const arrayBuffer = await fetch(URL.createObjectURL(file)).then((res) =>
        res.arrayBuffer()
      );
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = await blobToURL(blob);
      setPdfUrl(url);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="py-2 px-4 bg-blue-500 text-white rounded-md cursor-pointer"
      />
      {pdfUrl && (
        <div className="mt-4">
          <iframe
            title="PDF Viewer"
            src={pdfUrl}
            className="w-full h-[600px]"
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
