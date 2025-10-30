import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useScrollAnimation } from '../utils/aos';

interface PurchaseCallToActionProps {
  onPurchaseClick: () => void;
}

export default function PurchaseCallToAction({ onPurchaseClick }: PurchaseCallToActionProps) {
  const boxRef = useScrollAnimation('fade-up');

  return (
    <div className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={boxRef}
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-12"
        >
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <ShoppingCart className="w-16 h-16 mx-auto text-white drop-shadow-lg" strokeWidth={2} />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
              Koçluk Satın Al
            </h2>

            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.2)' }}>
              YKS hedeflerinize ulaşmak için uzman koçlarımızla çalışmaya bugün başlayın.
              Kişiselleştirilmiş programlar, haftalık görüşmeler ve 7/24 WhatsApp desteği ile yanınızdayız.
            </p>

            <button
              onClick={onPurchaseClick}
              className="bg-white text-amber-600 px-10 py-5 rounded-xl text-xl font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-3 group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Koçluk Paketi Satın Al</span>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-20 -ml-32 -mb-32" />
        </div>
      </div>
    </div>
  );
}
