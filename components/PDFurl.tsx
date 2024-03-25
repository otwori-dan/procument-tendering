// PNGview.tsx

import React from 'react';
type pngProps = {
  url: string;
};



export default function PNGview({ url }: pngProps) {
  // Manipulate the url to change the file extension from .pdf to .png
  const imageUrl = url.replace(/\.pdf$/, '.png');

  return (
    <div className="container mx-auto overflow-hidden max-h-[600px] my-8">
      <div className="mt-4  flex justify-center overflow-y-auto">
        <img src={imageUrl} alt="PDF as Image" className="w-[40%] mx-auto h-full" />
      </div>
    </div>
  );
};


