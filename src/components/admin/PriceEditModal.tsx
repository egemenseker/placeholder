import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface PriceEditModalProps {
  onClose: () => void;
}

export default function PriceEditModal({ onClose }: PriceEditModalProps) {
  const { coaches, updateCoach } = useApp();
  const [globalPrice, setGlobalPrice] = useState<number>(0);
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedCoaches.length === coaches.length) {
      setSelectedCoaches([]);
    } else {
      setSelectedCoaches(coaches.map(c => c.id));
    }
  };

  const handleCoachToggle = (coachId: string) => {
    setSelectedCoaches(prev => 
      prev.includes(coachId) 
        ? prev.filter(id => id !== coachId)
        : [...prev, coachId]
    );
  };

  const handleApplyPrice = () => {
    if (globalPrice <= 0) {
      alert('Lütfen geçerli bir fiyat giriniz.');
      return;
    }

    if (selectedCoaches.length === 0) {
      alert('Lütfen en az bir koç seçiniz.');
      return;
    }

    selectedCoaches.forEach(coachId => {
      updateCoach(coachId, { price: globalPrice });
    });

    alert(`${selectedCoaches.length} koçun fiyatı güncellendi!`);
    onClose();
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Koç Fiyatlarını Düzenle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Fiyat (₺)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={globalPrice}
                onChange={(e) => setGlobalPrice(parseInt(e.target.value) || 0)}
                className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yeni fiyat giriniz"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Koçları Seçin</h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedCoaches.length === coaches.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCoaches.includes(coach.id)}
                      onChange={() => handleCoachToggle(coach.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {coach.firstName} {coach.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getFieldName(coach.field)} - Mevcut: ₺{coach.price.toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleApplyPrice}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Fiyatları Güncelle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}