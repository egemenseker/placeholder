import React from 'react';
import { Instagram, Youtube } from 'lucide-react';

interface HeaderProps {
  onPurchaseClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onPurchaseClick, onLogoClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
          >
            <img 
              src="/logo.png" 
              alt="Arı Koçluk Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-softBlack hidden md:block">Arı Koçluk</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-sm md:text-base">
            <button onClick={onLogoClick} className="text-softBlack hover:text-warmAmber transition-colors hidden md:block font-bold">
              Ana Sayfa
            </button>
            <button onClick={onPurchaseClick} className="text-softBlack hover:text-warmAmber transition-colors font-bold">
              Koçluk Paketi Satın Al
            </button>
            <a 
              href="https://forms.gle/ZQZzmRPK9vE5rCBG8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-softBlack hover:text-warmAmber transition-colors font-bold"
            >
              Koç Olmak İster Misin?
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <a 
              href="https://www.instagram.com/serkanpakfiliz.yks?igsh=MXVwM3luZjdoZ3Z1cg%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-softBlack hover:text-pink-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.youtube.com/channel/UCIsci_KrVnUwu9zrxaAkE1w" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-softBlack hover:text-red-600 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}