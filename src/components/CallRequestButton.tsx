import React from 'react';
import { Phone } from 'lucide-react';

interface CallRequestButtonProps {
  onClick: () => void;
}

export default function CallRequestButton({ onClick }: CallRequestButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-beeOrange hover:bg-orange-600 text-white px-3 py-3 rounded-l-xl shadow-2xl transition-all duration-300 hover:scale-105 z-40 group"
      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-xl font-bold whitespace-nowrap">
          Sizi Arayalım
        </span>
      </div>
    </button>
  );
}