import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface TrialSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialSessionForm({ isOpen, onClose }: TrialSessionFormProps) {
  const { addTrialSession } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    field: 'SAY' as 'EA' | 'SAY' | 'SÖZ' | 'DİL',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrialSession(formData);
    setFormData({ fullName: '', phone: '', field: 'SAY' });
    onClose();
    alert('Deneme dersi talebiniz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Deneme Dersi Talebi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Adınızı ve soyadınızı giriniz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon Numarası
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5xxxxxxxxx"
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

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}