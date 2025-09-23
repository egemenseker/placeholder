import React from 'react';
import { Phone } from 'lucide-react';

interface CallRequestButtonProps {
  onClick: () => void;
}

export default function CallRequestButton({ onClick }: CallRequestButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-warmAmber hover:bg-darkAmber text-white px-4 py-3 rounded-l-lg shadow-lg transition-all duration-300 hover:scale-105 z-40 group"
      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
    >
      <div className="flex flex-col items-center space-y-2">
        <Phone className="w-5 h-5 group-hover:animate-pulse" />
        <span className="text-sm font-semibold whitespace-nowrap transform rotate-180">
          Sizi Arayalım
        </span>
      </div>
    </button>
  );
}