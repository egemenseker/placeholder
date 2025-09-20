import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import CoachDetailModal from './CoachDetailModal';

export default function CoachCarousel() {
  const { coaches } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % coaches.length);
    }, 4000); // Slower transition for smoother effect

    return () => clearInterval(interval);
  }, [coaches.length]);

  // Create infinite loop effect
  const extendedCoaches = [...coaches, ...coaches, ...coaches];
  const visibleCoaches = extendedCoaches.slice(currentIndex, currentIndex + 3);

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="bg-creamWhite py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-softBlack mb-8">
          Uzman Koçlarımız
        </h2>
        
        <div className="overflow-hidden">
          <div className="flex space-x-6 justify-center transition-transform duration-1000 ease-in-out">
            {visibleCoaches.map((coach, index) => (
              <button 
                key={`${coach.id}-${index}`}
                onClick={() => setSelectedCoach(coach.id)}
                className="group flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-warmAmber"
              >
                <div 
                  className="h-72 bg-cover bg-center relative overflow-hidden"
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${coach.profilePhoto}')` 
                  }}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
                       style={{ backgroundImage: `url('${coach.profilePhoto}')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <p className="text-sm opacity-90">
                      {coach.university} - {coach.department}
                    </p>
                    <p className="text-xs opacity-80 mb-1">
                      Alan: {getFieldName(coach.field)}
                    </p>
                    <p className="text-xs opacity-80">
                      YKS Sıralaması: {coach.ranking}
                    </p>
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
            onPurchase={() => {
              // This would need to be connected to purchase flow
              alert('Purchase functionality would be connected here');
            }}
          />
        )}
      </div>
    </div>
  );
}