import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

interface HeaderProps {
  showDebugButtons?: boolean;
  onCoachPanelClick?: () => void;
  onAdminPanelClick?: () => void;
  onPurchaseClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ showDebugButtons, onCoachPanelClick, onAdminPanelClick, onPurchaseClick, onLogoClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
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
            <span className="text-xl font-bold text-softBlack">Arı Koçluk</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={onLogoClick}
              className="text-softBlack hover:text-warmAmber transition-colors"
            >
              Ana Sayfa
            </button>
            <button onClick={onPurchaseClick} className="text-softBlack hover:text-warmAmber transition-colors">
              Koçluk Paketi Satın Al
            </button>
            <a 
              href="https://forms.gle/ZQZzmRPK9vE5rCBG8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-softBlack hover:text-warmAmber transition-colors"
            >
              Koç Olmak İster Misin?
            </a>
          </nav>

          {/* Debug Buttons */}
          {showDebugButtons && (
            <div className="absolute left-4 top-20 flex space-x-2 z-50">
              <button
                onClick={onCoachPanelClick}
                className="px-3 py-1 text-sm bg-warmAmber text-white rounded hover:bg-darkAmber transition-colors shadow-lg"
              >
                Koç Paneli
              </button>
              <button
                onClick={onAdminPanelClick}
                className="px-3 py-1 text-sm bg-beeOrange text-white rounded hover:bg-orange-600 transition-colors shadow-lg"
              >
                Admin Paneli
              </button>
            </div>
          )}

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.instagram.com/serkanpakfiliz.yks?igsh=MXVwM3luZjdoZ3Z1cg%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-softBlack hover:text-pink-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/+905432069594" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-softBlack hover:text-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}