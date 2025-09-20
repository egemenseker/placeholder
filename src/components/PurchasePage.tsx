import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface PurchasePageProps {
  coachId: string;
  onBack: () => void;
}

export default function PurchasePage({ coachId, onBack }: PurchasePageProps) {
  const { coaches } = useApp();
  const coach = coaches.find(c => c.id === coachId);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    field: 'SAY' as 'EA' | 'SAY' | 'SÖZ' | 'DİL',
  });

  if (!coach) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would integrate with iyzico payment system
    alert('Bu bölüm iyzico entegrasyonu ile tamamlanacaktır. Şimdilik demo amaçlı gösterilmektedir.');
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coach Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seçilen Koç</h2>
            
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={coach.profilePhoto}
                alt={`${coach.firstName} ${coach.lastName}`}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {coach.firstName} {coach.lastName}
                </h3>
                <p className="text-gray-600">Sıralama: {coach.ranking}</p>
                <p className="text-gray-600">Alan: {getFieldName(coach.field)}</p>
                <p className="text-gray-600">{coach.university}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Aylık Ücret:</span>
                <span className="text-xl font-bold text-blue-600">
                  ₺{coach.price.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">İlk Ödeme:</span>
                <span className="text-xl font-bold text-green-600">
                  ₺{coach.price.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ödeme Bilgileri</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alan
                </label>
                <select
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SAY">Sayısal</option>
                  <option value="EA">Eşit Ağırlık</option>
                  <option value="SÖZ">Sözel</option>
                  <option value="DİL">Dil</option>
                </select>
              </div>

              {/* Payment Section Placeholder */}
              <div className="border-t pt-6">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    iyzico Ödeme Entegrasyonu
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bu bölüm iyzico ödeme sistemi ile tamamlanacaktır.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Güvenli Ödeme</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ödemeyi Tamamla - ₺{coach.price.toLocaleString('tr-TR')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}