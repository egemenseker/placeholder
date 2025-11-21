import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import CoachDetailModal from './CoachDetailModal';

export default function CoachCarousel() {
  const { coaches } = useApp();
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

  // Create enough copies for seamless infinite scroll
  const infiniteCoaches = [...coaches, ...coaches, ...coaches, ...coaches, ...coaches, ...coaches];

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="bg-gradient-to-b from-creamWhite to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-softBlack mb-3 inline-block relative">
            Uzman Koçlarımız
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-warmAmber to-transparent" />
          </h2>
          <p className="text-gray-600 mt-4 text-lg">Türkiye'nin en başarılı öğrencileri sizin için burada</p>
        </div>

        {/* BURAYA py-12 EKLENDİ: Kartlar büyüdüğünde kesilmemesi için üstten ve alttan boşluk bırakıldı */}
        <div className="overflow-hidden relative py-12" style={{ zIndex: 1 }}>
          {/* Gradient Overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-creamWhite to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex space-x-8 animate-slide-infinite" style={{ width: 'max-content' }}>
            {infiniteCoaches.map((coach, index) => (
              <button
                key={`${coach.id}-${index}`}
                onClick={() => setSelectedCoach(coach.id)}
                className="premium-card group flex-shrink-0 w-72 bg-white rounded-2xl shadow-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-warmAmber/50 glow-effect relative z-0 hover:z-50 transition-all duration-300"
              >
                <div
                  className="h-80 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${coach.profilePhoto}')`
                  }}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-120 group-hover:brightness-110"
                       style={{ backgroundImage: `url('${coach.profilePhoto}')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/70" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500 group-hover:translate-y-0 translate-y-1">
                    <h3 className="text-xl font-bold text-white mb-2 transform transition-all duration-500 group-hover:scale-105" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <p className="text-sm text-white/95 mb-2 font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                      {coach.university}
                    </p>
                    <p className="text-xs text-white/90 mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                      {coach.department}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/30">
                      <p className="text-xs text-white/90 font-semibold">
                        {getFieldName(coach.field)}
                      </p>
                      <p className="text-xs text-warmAmber font-bold bg-black/30 px-2 py-1 rounded">
                        #{coach.ranking}
                      </p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute top-4 right-4 bg-warmAmber text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
                    Detayları Gör
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedCoach && (
          <CoachDetailModal
            coachId={selectedCoach}
            onClose={() => setSelectedCoach(null)}
            onPurchase={(coachId) => {
              window.dispatchEvent(new CustomEvent('navigateToPurchase', { detail: { coachId } }));
              setSelectedCoach(null);
            }}
          />
        )}
      </div>
    </div>
  );
}