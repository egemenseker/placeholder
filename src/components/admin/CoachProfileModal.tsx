import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface CoachProfileModalProps {
  coachId: string;
  onClose: () => void;
}

export default function CoachProfileModal({ coachId, onClose }: CoachProfileModalProps) {
  const { coaches, updateCoach } = useApp();
  const coach = coaches.find(c => c.id === coachId);
  const [adminNotes, setAdminNotes] = useState(coach?.adminnotes || '');

  if (!coach) return null;

  const handleSaveNotes = () => {
    updateCoach(coachId, { adminnotes: adminNotes });
    alert('Admin notları kaydedildi!');
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Koç Profili - {coach.firstname} {coach.lastname}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coach Information */}
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <img
                  src={coach.profilephoto || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'}
                  alt={`${coach.firstname} ${coach.lastname}`}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {coach.firstname} {coach.lastname}
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>E-posta:</strong> {coach.email}</p>
                    <p><strong>Alan:</strong> {getFieldName(coach.field)}</p>
                    <p><strong>YKS Sıralaması:</strong> {coach.ranking}</p>
                    <p><strong>İlk TYT Neti:</strong> {coach.tytscore}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Eğitim Bilgileri</h4>
                  <p><strong>Üniversite:</strong> {coach.university}</p>
                  <p><strong>Bölüm:</strong> {coach.department}</p>
                  <p><strong>Mezuniyet:</strong> {coach.hasgapyear ? 'Mezun' : 'Bu Yıl Mezun'}</p>
                  <p><strong>Özel Dershane:</strong> {coach.attendedprivateinstitution ? 'Evet' : 'Hayır'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Durum Bilgileri</h4>
                  <p><strong>Aylık Ücret:</strong> ₺{coach.price.toLocaleString('tr-TR')}</p>
                  <p><strong>Kontenjan:</strong> {coach.quotafull ? 'Dolu' : 'Müsait'}</p>
                  <p><strong>Kayıt Tarihi:</strong> {new Date(coach.registereddate).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Koç Açıklaması</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {coach.description || 'Açıklama eklenmemiş.'}
                </p>
              </div>
            </div>

            {/* Admin Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Admin Notları</h3>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Not:</strong> Bu notlar sadece adminler tarafından görülebilir. Koçlar bu notlara erişemez.
                </p>
              </div>

              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bu koç hakkında admin notlarınızı buraya yazabilirsiniz..."
              />

              <button
                onClick={handleSaveNotes}
                className="flex items-center space-x-2 w-full justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Notları Kaydet</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}