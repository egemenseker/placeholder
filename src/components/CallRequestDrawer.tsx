import React, { useState } from 'react';
import { X, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CallRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallRequestDrawer({ isOpen, onClose }: CallRequestDrawerProps) {
  const { addCallRequest } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    userType: 'Öğrenciyim' as 'Veliyim' | 'Öğrenciyim',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (value: 'Veliyim' | 'Öğrenciyim') => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert('Lütfen ad soyad giriniz.');
      return;
    }

    if (formData.phone.length !== 11 || !formData.phone.startsWith('0')) {
      alert('Telefon numarası 11 haneli olmalı ve 0 ile başlamalıdır.');
      return;
    }

    try {
      await addCallRequest({
        fullName: formData.fullName,
        userType: formData.userType,
        phone: formData.phone,
      });

      alert('Talebiniz alındı! En kısa sürede sizi arayacağız.');
      setFormData({ fullName: '', userType: 'Öğrenciyim', phone: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting call request:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Drawer Panel */}
        <div 
          className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <Phone className="w-6 h-6 text-warmAmber" />
            <h2 className="text-xl font-bold text-softBlack">Sizi Arayalım</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-softBlack mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                placeholder="Adınızı ve soyadınızı giriniz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-softBlack mb-3">
                Kimliğiniz *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    checked={formData.userType === 'Veliyim'}
                    onChange={() => handleRadioChange('Veliyim')}
                    className="h-4 w-4 text-warmAmber focus:ring-warmAmber border-gray-300"
                  />
                  <span className="ml-2 text-softBlack">Veliyim</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    checked={formData.userType === 'Öğrenciyim'}
                    onChange={() => handleRadioChange('Öğrenciyim')}
                    className="h-4 w-4 text-warmAmber focus:ring-warmAmber border-gray-300"
                  />
                  <span className="ml-2 text-softBlack">Öğrenciyim</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-softBlack mb-2">
                Telefon Numarası *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                placeholder="05xxxxxxxxx"
                maxLength={11}
              />
              <p className="text-xs text-gray-500 mt-1">
                11 haneli telefon numaranızı 0 ile başlayarak giriniz
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-warmAmber hover:bg-darkAmber text-white py-2 px-3 rounded-lg font-semibold transition-colors"
            >
              Gönder
            </button>
          </form>

          {/* Info Text */}
          <div className="px-6 pb-6 mt-4">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-sm text-softBlack">
                <strong>Bilgi:</strong> Talebinizi aldıktan sonra en kısa sürede sizi arayarak 
                detaylı bilgi vereceğiz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
