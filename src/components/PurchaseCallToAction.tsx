import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';
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
          className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-16 pulse-glow"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent shimmer-effect" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="mb-8 float-animation">
              <ShoppingCart className="w-20 h-20 mx-auto text-white drop-shadow-2xl" strokeWidth={2.5} />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-300" style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.4)' }}>
              ARI YKS 
              KOÇLUK PAKETİ
            </h2>

            <div className="text-5xl md:text-6xl font-bold text-white mb-8" style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.4)' }}>
              ₺ 2795 <span className="text-2xl md:text-3xl">/ 4 HAFTA</span>
            </div>

            <div className="max-w-2xl mx-auto mb-10 space-y-3">
              {[
                'Özenle seçilmiş, halinden anlayan koç',
                'Sana özel hazırlanmış günlük program',
                'Haftada 1 görüntülü görüşme',
                'Her gün sınırsız WhatsApp konuşması',
                'Program revize desteği',
                'Deneme analizi',
                'Günlük takip'
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-3 text-white text-lg md:text-xl font-medium" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  <Check className="w-6 h-6 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onPurchaseClick}
              className="premium-button bg-white text-amber-600 px-12 py-6 rounded-xl text-xl font-bold shadow-2xl inline-flex items-center space-x-3 group relative z-20"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>KOÇLUK SATIN AL</span>
            </button>
          </div>

          {/* Decorative Elements with Animation */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl opacity-20 -mr-40 -mt-40 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400 rounded-full blur-3xl opacity-20 -ml-40 -mb-40 animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4 border-white/30 rounded-tl-2xl" />
          <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4 border-white/30 rounded-br-2xl" />
        </div>
      </div>
    </div>
  );
}
