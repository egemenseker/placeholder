import React, { useState } from 'react';
import { Camera, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function CoachProfile() {
  const { user, coaches, updateCoach } = useApp();
  const coach = coaches.find(c => c.id === user?.coachId);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: coach?.firstName || '',
    lastName: coach?.lastName || '',
    email: coach?.email || '',
    password: coach?.password || '',
    field: coach?.field || 'SAY' as 'EA' | 'SAY' | 'SÖZ' | 'DİL',
    ranking: coach?.ranking || 0,
    description: coach?.description || '',
    hasGapYear: coach?.hasGapYear || false,
    tytScore: coach?.tytScore || 0,
    university: coach?.university || '',
    department: coach?.department || '',
    attendedPrivateInstitution: coach?.attendedPrivateInstitution || false,
    quotaFull: coach?.quotaFull || false,
    price: coach?.price || 0,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (coach) {
          updateCoach(coach.id, { profilePhoto: imageUrl });
          alert('Profil fotoğrafı güncellendi!');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseInt(value) || 0 : value 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coach) {
      updateCoach(coach.id, formData);
      alert('Profil bilgileri güncellendi!');
    }
  };

  if (!coach) return <div>Koç bilgileri bulunamadı!</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={coach.profilePhoto || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Profil Fotoğrafı</h3>
            <p className="text-sm text-gray-600">JPG veya PNG dosyası yükleyiniz</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alan</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YKS Sıralaması</label>
            <input
              type="number"
              name="ranking"
              value={formData.ranking}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İlk TYT Neti</label>
            <input
              type="number"
              name="tytScore"
              value={formData.tytScore}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Üniversite</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasGapYear"
              name="hasGapYear"
              checked={formData.hasGapYear}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasGapYear" className="ml-2 block text-sm text-gray-900">
              Mezun
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="attendedPrivateInstitution"
              name="attendedPrivateInstitution"
              checked={formData.attendedPrivateInstitution}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="attendedPrivateInstitution" className="ml-2 block text-sm text-gray-900">
              Dershaneye gittim
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="quotaFull"
              name="quotaFull"
              checked={formData.quotaFull}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="quotaFull" className="ml-2 block text-sm text-gray-900">
              Kontenjan dolu
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kendiniz Hakkında</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Kendinizden, deneyimlerinizden ve eğitim yaklaşımınızdan bahsedin..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}