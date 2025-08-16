"use client";

import React from "react";
import { BookOpen } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Dynamic Animation: Pulsing Circle with Bouncing Dots */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 bg-blue-500 rounded-full animate-pulse opacity-20"></div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0ms]"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms]"></div>
          </div>
        </div>
        {/* School Icon for Branding */}
        <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
        {/* Loading Text with Typing Animation */}
        <div className="flex items-center space-x-1 text-sm font-medium text-gray-700">
          <span>Loading</span>
          <span className="animate-[typing_1.5s_steps(3)_infinite] overflow-hidden whitespace-nowrap">
            ...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
