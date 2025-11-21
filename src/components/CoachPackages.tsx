import React, { useState } from 'react';
import { Filter, Star, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import CoachDetailModal from './CoachDetailModal';
import PurchasePage from './PurchasePage';

export default function CoachPackages() {
  const { coaches } = useApp();
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedGapYear, setSelectedGapYear] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [showPurchase, setShowPurchase] = useState<string | null>(null);

  const filteredCoaches = coaches
    .filter(coach => !selectedField || coach.field === selectedField)
    .filter(coach => !selectedGapYear || coach.hasGapYear.toString() === selectedGapYear)
    .sort((a, b) => a.ranking - b.ranking);

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  const handlePurchase = (coachId: string) => {
    setShowPurchase(coachId);
  };

  if (showPurchase) {
    return <PurchasePage coachId={showPurchase} onBack={() => setShowPurchase(null)} />;
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Koçluk Paketleri
        </h2>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">Filtrele</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alan</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tümü</option>
                <option value="SAY">Sayısal</option>
                <option value="EA">Eşit Ağırlık</option>
                <option value="SÖZ">Sözel</option>
                <option value="DİL">Dil</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mezuniyet Yılı</label>
              <select
                value={selectedGapYear}
                onChange={(e) => setSelectedGapYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tümü</option>
                <option value="false">Bu Yıl Mezun</option>
                <option value="true">Mezun</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coach Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCoaches.map((coach) => (
            <div 
              key={coach.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 border-2 ${
                coach.quotaFull ? 'border-red-300' : 'border-green-300'
              }`}
            >
              <div className="h-48 bg-cover bg-center" 
                   style={{ backgroundImage: `url('${coach.profilePhoto}')` }} />
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {coach.firstName} {coach.lastName}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p><strong>Sıralama:</strong> {coach.ranking}</p>
                  <p><strong>Alan:</strong> {getFieldName(coach.field)}</p>
                  <p><strong>Üniversite:</strong> {coach.university}</p>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  {coach.quotaFull ? (
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Kontenjan Dolu</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Kontenjan Var</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePurchase(coach.id)}
                    disabled={coach.quotaFull}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      coach.quotaFull
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Satın Al
                  </button>
                  <button
                    onClick={() => setSelectedCoach(coach.id)}
                    className="flex-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Detaylı Bilgi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCoaches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Seçilen kriterlere uygun koç bulunamadı.</p>
          </div>
        )}

        {selectedCoach && (
          <CoachDetailModal
            coachId={selectedCoach}
            onClose={() => setSelectedCoach(null)}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </div>
  );
}