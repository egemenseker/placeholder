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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex-none px-6 py-4 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-softBlack">Koç Detayları</h2>
          <button onClick={onClose} className="text-softBlack hover:text-warmAmber transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sol Kolon: Profil ve Özet Bilgiler */}
            <div className="w-full md:w-5/12 flex flex-col space-y-6 flex-shrink-0">
              <div className="flex items-start space-x-4">
                <img
                  src={coach.profilePhoto}
                  alt={`${coach.firstName} ${coach.lastName}`}
                  className="w-24 h-24 rounded-lg object-cover shadow-md"
                />
                <div>
                  <h3 className="text-xl font-bold text-softBlack">
                    {coach.firstName} {coach.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{coach.university}</p>
                  <p className="text-xs text-gray-500">{coach.department}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-softBlack bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between"><strong>Sıralama:</strong> <span>{coach.ranking}</span></div>
                <div className="flex justify-between"><strong>Alan:</strong> <span>{getFieldName(coach.field)}</span></div>
                <div className="flex justify-between"><strong>TYT Puanı:</strong> <span>{coach.tytScore}</span></div>
                <div className="flex justify-between"><strong>Mezuniyet:</strong> <span>{coach.hasGapYear ? 'Mezun (Gap Year)' : 'Bu Yıl Mezun'}</span></div>
                <div className="flex justify-between"><strong>Özel Dershane:</strong> <span>{coach.attendedPrivateInstitution ? 'Evet' : 'Hayır'}</span></div>
              </div>

              <div className="space-y-2">
                 <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-warmAmber">₺{coach.price.toLocaleString('tr-TR')}</span>
                    <span className="text-sm text-gray-500">/ aylık</span>
                 </div>
                 <div className="flex items-center text-sm">
                    {coach.quotaFull ? (
                      <span className="flex items-center text-red-600 font-medium"><XCircle className="w-4 h-4 mr-1"/> Kontenjan Dolu</span>
                    ) : (
                      <span className="flex items-center text-green-600 font-medium"><CheckCircle className="w-4 h-4 mr-1"/> Kontenjan Mevcut</span>
                    )}
                 </div>
              </div>
            </div>

            {/* Sağ Kolon: Hakkında Yazısı */}
            <div className="w-full md:w-7/12">
              <h4 className="text-lg font-semibold text-softBlack mb-3">Hakkında</h4>
              <p className="text-softBlack text-sm leading-relaxed whitespace-pre-line text-justify">
                {coach.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-6 border-t bg-gray-50">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-warmAmber text-warmAmber rounded-lg hover:bg-warmAmber/10 transition-colors font-medium"
            >
              Kapat
            </button>
            <button
              onClick={() => onPurchase(coach.id)}
              disabled={coach.quotaFull}
              className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors shadow-lg active:scale-95 ${
                coach.quotaFull
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-warmAmber text-white hover:bg-darkAmber'
              }`}
            >
              {coach.quotaFull ? 'Kontenjan Dolu' : 'Hemen Başla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}