import React, { useState } from 'react';
import { Filter, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import CoachDetailModal from './CoachDetailModal';
import PurchasePage from './PurchasePage';
import { useScrollAnimation } from '../utils/aos';

interface PurchaseMainPageProps {
  onBack: () => void;
}

export default function PurchaseMainPage({ onBack }: PurchaseMainPageProps) {
  const { coaches } = useApp();
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedGapYear, setSelectedGapYear] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [showPurchase, setShowPurchase] = useState<string | null>(null);
  const headerRef = useScrollAnimation('fade-up');
  const filtersRef = useScrollAnimation('fade-in');
  const gridRef = useScrollAnimation('fade-up');

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
    <div className="min-h-screen bg-lightCream">
      {/* Header */}
      <div ref={headerRef} className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-warmAmber hover:text-darkAmber"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </button>
            <h1 className="text-xl font-bold text-softBlack">Koçluk Paketleri</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-softBlack mb-12">
            Koçluk Paketleri
          </h2>

          {/* Filters */}
          <div ref={filtersRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Filter className="w-5 h-5 text-warmAmber" />
              <span className="text-lg font-semibold text-softBlack">Filtrele</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-softBlack mb-2">Alan</label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="SAY">Sayısal</option>
                  <option value="EA">Eşit Ağırlık</option>
                  <option value="SÖZ">Sözel</option>
                  <option value="DİL">Dil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-softBlack mb-2">Mezuniyet Yılı</label>
                <select
                  value={selectedGapYear}
                  onChange={(e) => setSelectedGapYear(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="false">Bu Yıl Mezun</option>
                  <option value="true">Mezun (Gap Year)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coach Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCoaches.map((coach) => (
              <div 
                key={coach.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg border-2 ${
                  coach.quotaFull ? 'border-red-500' : 'border-green-500'
                }`}
              >
                <div className="h-48 bg-cover bg-center overflow-hidden">
                  <div 
                    className="h-full bg-cover bg-center transition-transform duration-300 hover:scale-110 hover:brightness-110"
                    style={{ backgroundImage: `url('${coach.profilePhoto}')` }}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-softBlack mb-2">
                    {coach.firstName} {coach.lastName}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-softBlack mb-3">
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
                      <div className="flex items-center text-warmAmber">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Kontenjan Var</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePurchase(coach.id)}
                      disabled={coach.quotaFull}
                      className={`flex-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        coach.quotaFull
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-warmAmber text-white hover:bg-darkAmber'
                      }`}
                    >
                      Satın Al
                    </button>
                    <button
                      onClick={() => setSelectedCoach(coach.id)}
                      className="flex-3 px-4 py-2 text-sm border border-warmAmber text-warmAmber rounded-lg hover:bg-lightCream transition-colors"
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
              <p className="text-softBlack text-lg">Seçilen kriterlere uygun koç bulunamadı.</p>
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
    </div>
  );
}