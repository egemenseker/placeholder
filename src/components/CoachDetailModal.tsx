import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CoachDetailModalProps {
  coachId: string;
  onClose: () => void;
  onPurchase: (coachId: string) => void;
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
    // Dış kapsayıcıya overflow-y-auto eklendi, böylece modal çok uzunsa sayfa scroll edilebilir.
    // flex-center kaldırılarak içerideki wrapper'a taşındı.
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] overflow-y-auto">
      
      {/* İçerik ortalama ve boşluk bırakma için wrapper */}
      <div className="flex min-h-full items-center justify-center p-4">
        
        {/* Modal: max-h ve overflow kaldırılarak içeriğin uzamasına izin verildi */}
        <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl relative">
          
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-bold text-softBlack">Koç Detayları</h2>
            <button onClick={onClose} className="text-softBlack hover:text-warmAmber">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-6 mb-6">
              <img
                src={coach.profilePhoto}
                alt={`${coach.firstName} ${coach.lastName}`}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-softBlack mb-2">
                  {coach.firstName} {coach.lastName}
                </h3>
                <div className="space-y-1 text-softBlack">
                  <p><strong>Sıralama:</strong> {coach.ranking}</p>
                  <p><strong>Alan:</strong> {getFieldName(coach.field)}</p>
                  <p><strong>Üniversite:</strong> {coach.university} - {coach.department}</p>
                  <p><strong>TYT Puanı:</strong> {coach.tytScore}</p>
                  <p><strong>Mezuniyet:</strong> {coach.hasGapYear ? 'Mezun (Gap Year)' : 'Bu Yıl Mezun'}</p>
                  <p><strong>Özel Dershane:</strong> {coach.attendedPrivateInstitution ? 'Evet' : 'Hayır'}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-softBlack mb-3">Fiyat</h4>
              <div className="text-3xl font-bold text-warmAmber">
                ₺{coach.price.toLocaleString('tr-TR')}
                <span className="text-base text-softBlack ml-2">/ aylık</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-softBlack mb-3">Kontenjan Durumu</h4>
              <div className="flex items-center space-x-2">
                {coach.quotaFull ? (
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-5 h-5 mr-2" />
                    <span>Kontenjan Dolu</span>
                  </div>
                ) : (
                  <div className="flex items-center text-warmAmber">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Kontenjan Mevcut</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-softBlack mb-3">Hakkında</h4>
              <p className="text-softBlack leading-relaxed">{coach.description}</p>
            </div>

            <div className="flex space-x-4 pt-4 border-t">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-warmAmber text-warmAmber rounded-lg hover:bg-lightCream transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => onPurchase(coach.id)}
                disabled={coach.quotaFull}
                className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors ${
                  coach.quotaFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-warmAmber text-white hover:bg-darkAmber'
                }`}
              >
                Satın Al
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}