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

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    // DÜZELTME: z-[100] yapılarak modalın diğer tüm elementlerin (InfoBoxes vb.) üzerinde görünmesi sağlandı.
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Orijinal Tasarım: my-8 ve overflow-visible bırakılarak doğal akışına dönüldü */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fadeIn my-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 group"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
        </button>

        {/* Sol Taraf - Fotoğraf */}
        <div className="w-full md:w-2/5 relative min-h-[300px] md:min-h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${coach.profilePhoto}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/50" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
             <h2 className="text-2xl font-bold text-white mb-1">{coach.firstName} {coach.lastName}</h2>
             <p className="text-white/90 text-sm">{coach.university}</p>
          </div>
        </div>

        {/* Sağ Taraf - Detaylar (Orijinal geniş/uzun görünüm) */}
        <div className="w-full md:w-3/5 bg-white p-8">
          <div className="hidden md:block mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-softBlack mb-2">{coach.firstName} {coach.lastName}</h2>
                <div className="flex items-center text-gray-600 gap-2">
                  <School className="w-5 h-5 text-warmAmber" />
                  <span className="text-lg">{coach.university}</span>
                  <span className="text-gray-300">•</span>
                  <span>{coach.department}</span>
                </div>
              </div>
              <div className="bg-warmAmber/10 px-4 py-2 rounded-xl border border-warmAmber/20">
                <span className="text-2xl font-bold text-warmAmber">#{coach.ranking}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">Alan</p>
              <p className="font-bold text-softBlack">{getFieldName(coach.field)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">Deneyim</p>
              <p className="font-bold text-softBlack">{coach.experience || '1+ Yıl'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">Öğrenci</p>
              <p className="font-bold text-softBlack">{coach.studentCount || '10+'}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-softBlack mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-warmAmber" />
              Koç Hakkında
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {coach.description}
            </p>
          </div>

          {/* Paketler */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-softBlack mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-warmAmber" />
              Paket Seçenekleri
            </h3>
            
            <div className="space-y-3">
              {coach.packages?.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-warmAmber transition-all cursor-pointer group bg-white hover:shadow-md"
                  onClick={() => onPurchase(coach.id, pkg.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-softBlack group-hover:text-warmAmber transition-colors">
                        {pkg.name}
                      </h4>
                      <p className="text-sm text-gray-500">{pkg.sessionCount} Seans • {pkg.duration} dk/seans</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-warmAmber">₺{pkg.price}</p>
                      <p className="text-xs text-gray-400">paket fiyatı</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Başlangıç Fiyatı</p>
                <p className="text-3xl font-bold text-warmAmber">
                  ₺{coach.hourlyRate} <span className="text-sm text-gray-400 font-normal">/ seans</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-softBlack">5.0</span>
                <span className="text-gray-400">(42)</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onPurchase(coach.id, 'trial')}
                className="flex-1 bg-white border-2 border-warmAmber text-warmAmber py-4 rounded-xl font-bold text-lg hover:bg-warmAmber/5 transition-colors"
              >
                Deneme Seansı
              </button>
              <button 
                onClick={() => onPurchase(coach.id, 'standard')}
                className="flex-[2] bg-warmAmber text-white py-4 rounded-xl font-bold text-lg hover:bg-warmAmber/90 shadow-lg shadow-warmAmber/20 transition-all hover:scale-[1.02] active:scale-95"
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