import React from 'react';
import { X, School, Award, BookOpen, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CoachDetailModalProps {
  coachId: string;
  onClose: () => void;
  onPurchase: (coachId: string, packageId: string) => void;
}

export default function CoachDetailModal({ coachId, onClose, onPurchase }: CoachDetailModalProps) {
  const { coaches } = useApp();
  const coach = coaches.find(c => c.id === coachId);

  if (!coach) return null;

  // Alan isimlendirmesi
  const getFieldName = (field: string) => {
    const fieldNames: { [key: string]: string } = { 
      SAY: 'Sayısal', 
      EA: 'Eşit Ağırlık', 
      SÖZ: 'Sözel', 
      DİL: 'Dil' 
    };
    return fieldNames[field] || field;
  };

  return (
    // Z-INDEX FIX: z-[100] ile modalın en üstte olması sağlandı
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fadeIn max-h-[90vh]">
        
        {/* Close Button - Absolute for easier positioning */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 group"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
        </button>

        {/* Sol Taraf: Fotoğraf ve Temel Bilgiler (Daha kompakt) */}
        <div className="w-full md:w-2/5 relative">
          <div className="h-48 md:h-full w-full relative">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${coach.profilePhoto}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/50" />
            
            {/* Mobil Görünümde İsim */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
               <h2 className="text-2xl font-bold text-white mb-1">{coach.firstName} {coach.lastName}</h2>
               <p className="text-white/90 text-sm">{coach.university}</p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Detaylar (Scroll yerine sığacak şekilde düzenlendi) */}
        <div className="w-full md:w-3/5 bg-white p-6 md:p-8 flex flex-col h-full">
          
          {/* Header Info (Desktop only visible) */}
          <div className="hidden md:block mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-softBlack mb-1">{coach.firstName} {coach.lastName}</h2>
                <div className="flex items-center text-gray-600 gap-2 text-sm">
                  <School className="w-4 h-4 text-warmAmber" />
                  <span>{coach.university}</span>
                  <span className="text-gray-300">•</span>
                  <span>{coach.department}</span>
                </div>
              </div>
              <div className="bg-warmAmber/10 px-3 py-1 rounded-lg border border-warmAmber/20">
                <span className="text-warmAmber font-bold">#{coach.ranking}</span>
              </div>
            </div>
          </div>

          {/* Ana İstatistikler - Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Alan</p>
              <p className="font-semibold text-softBlack text-sm">{getFieldName(coach.field)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Deneyim</p>
              <p className="font-semibold text-softBlack text-sm">{coach.experience || '1+ Yıl'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Öğrenci</p>
              <p className="font-semibold text-softBlack text-sm">{coach.studentCount || '10+'}</p>
            </div>
          </div>

          {/* Hakkında - Kısaltılmış veya tam sığacak şekilde */}
          <div className="mb-5 flex-grow">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-warmAmber" />
              Koç Hakkında
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 md:line-clamp-none">
              {coach.description}
            </p>
          </div>

          {/* Paket Seçimi ve Aksiyon */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Başlangıç Fiyatı</p>
                <p className="text-xl font-bold text-warmAmber">
                  ₺{coach.hourlyRate} <span className="text-xs text-gray-400 font-normal">/ seans</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold text-softBlack">4.9</span>
                <span className="text-gray-400">(50+ Değerlendirme)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => onPurchase(coach.id, 'trial')}
                className="flex-1 bg-white border-2 border-warmAmber text-warmAmber py-2.5 rounded-xl font-bold hover:bg-warmAmber/5 transition-colors text-sm"
              >
                Deneme Seansı
              </button>
              <button 
                onClick={() => onPurchase(coach.id, 'standard')}
                className="flex-[2] bg-warmAmber text-white py-2.5 rounded-xl font-bold hover:bg-warmAmber/90 shadow-lg shadow-warmAmber/20 transition-all hover:scale-[1.02] active:scale-95 text-sm"
              >
                Koçluk Al
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}