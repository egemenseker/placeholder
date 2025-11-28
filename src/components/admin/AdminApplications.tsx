import React, { useMemo } from 'react';
import { Check, Phone, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function AdminApplications() {
  const { trialSessions, callRequests, updateTrialSession, updateCallRequest } = useApp();

  // Sort trial sessions: uncalled first, then by date
  const sortedTrialSessions = useMemo(() => {
    return [...trialSessions].sort((a, b) => {
      if (a.isCalled === b.isCalled) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isCalled ? 1 : -1;
    });
  }, [trialSessions]);

  // Sort call requests: uncalled first, then by date
  const sortedCallRequests = useMemo(() => {
    return [...callRequests].sort((a, b) => {
      if (a.isCalled === b.isCalled) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isCalled ? 1 : -1;
    });
  }, [callRequests]);

  const handleTrialSessionToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateTrialSession(id, { isCalled: !currentStatus });
    } catch (error) {
      console.error('Error updating trial session:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleCallRequestToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateCallRequest(id, { isCalled: !currentStatus });
    } catch (error) {
      console.error('Error updating call request:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Trial Sessions Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Ücretsiz Ön Görüşme Talepleri</h2>
        </div>

        {sortedTrialSessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz ön görüşme talebi bulunmamaktadır.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ad Soyad</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefon</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Alan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tarih</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Durum</th>
                </tr>
              </thead>
              <tbody>
                {sortedTrialSessions.map((session) => (
                  <tr
                    key={session.id}
                    className={`border-b border-gray-100 transition-colors duration-300 ${
                      session.isCalled ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-900">{session.fullName}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://wa.me/${session.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {session.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{getFieldName(session.field)}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(session.createdAt)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTrialSessionToggle(session.id, session.isCalled)}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                          session.isCalled
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                        title={session.isCalled ? 'Arandı olarak işaretle' : 'Aranmadı olarak işaretle'}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call Requests Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Phone className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sizi Arayalım Talepleri</h2>
        </div>

        {sortedCallRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz arama talebi bulunmamaktadır.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ad Soyad</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kimlik</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefon</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tarih</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Durum</th>
                </tr>
              </thead>
              <tbody>
                {sortedCallRequests.map((request) => (
                  <tr
                    key={request.id}
                    className={`border-b border-gray-100 transition-colors duration-300 ${
                      request.isCalled ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-900">{request.fullName}</td>
                    <td className="py-3 px-4 text-gray-900">{request.userType}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://wa.me/${request.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {request.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(request.createdAt)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleCallRequestToggle(request.id, request.isCalled)}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                          request.isCalled
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                        title={request.isCalled ? 'Arandı olarak işaretle' : 'Aranmadı olarak işaretle'}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
