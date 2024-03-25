// components/Layout.tsx

import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: React.ReactNode;
 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900">
      <header className="bg-transparent dark:bg-gray-800 shadow-sm
      opacity-90
      transition duration-300 ease-in-out
      backdrop-filter backdrop-blur-lg
      z-50
      fixed w-full top-0 left-0 right-0
      ">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-800 py-1 dark:text-gray-200">
             Easily manage your tenders
          </h1>
          <div  className="flex items-center justify-start flex-row gap-x-3">
        <Badge className="flex items-center space-x-2 text-gray-500 dark:text-gray-400  cursor-pointer" onClick={() => window.history.back()}>
        <ArrowLeft className="h-6 w-6 text-white" />
        <span className=' text-white'>Back 

        </span>
        </Badge>
       
        {/* go back */}
        
       </div>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 my-24">
        {children}
      </main>
      <footer className="bg-transparent dark:bg-gray-800 ">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} Tender App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

