import React from 'react';
import { Instagram, Youtube } from 'lucide-react';

interface HeaderProps {
  onPurchaseClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onPurchaseClick, onLogoClick }: HeaderProps) {
  return (
    <header className="glass-effect shadow-lg sticky top-0 z-30 border-b border-warmAmber/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={onLogoClick}
          >
            <img
              src="/logo.png"
              alt="Arı Koçluk Logo"
              className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-warmAmber/50"
            />
            <span className="text-xl font-bold text-softBlack hidden md:block">Arı Koçluk</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-sm md:text-base">
            <button
              onClick={onLogoClick}
              className="text-softBlack hover:text-warmAmber transition-all duration-300 hidden md:block font-bold relative group"
            >
              Ana Sayfa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warmAmber transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={onPurchaseClick}
              className="text-softBlack hover:text-warmAmber transition-all duration-300 font-bold relative group"
            >
              Koçluk Paketi Satın Al
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warmAmber transition-all duration-300 group-hover:w-full"></span>
            </button>
            <a
              href="https://forms.gle/ZQZzmRPK9vE5rCBG8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-softBlack hover:text-warmAmber transition-all duration-300 font-bold relative group"
            >
              Koç Olmak İster Misin?
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warmAmber transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <a
              href="https://www.instagram.com/serkanpakfiliz.yks?igsh=MXVwM3luZjdoZ3Z1cg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-softBlack hover:text-pink-600 transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCIsci_KrVnUwu9zrxaAkE1w"
              target="_blank"
              rel="noopener noreferrer"
              className="text-softBlack hover:text-red-600 transition-all duration-300 hover:scale-110"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}