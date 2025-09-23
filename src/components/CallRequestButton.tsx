import React from 'react';
import { Phone } from 'lucide-react';

interface CallRequestButtonProps {
  onClick: () => void;
}

export default function CallRequestButton({ onClick }: CallRequestButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-beeOrange hover:bg-orange-600 text-white px-4 py-3 rounded-l-lg shadow-lg transition-all duration-300 hover:scale-105 z-40 group"
      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
    >
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold whitespace-nowrap">
          Sizi Arayalım
        </span>
      </div>
    </button>
  );
}