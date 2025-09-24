import React, { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, Users, User, DollarSign, FileText, Eye } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AddCoachModal from './AddCoachModal';
import EditCoachModal from './EditCoachModal';
import PriceEditModal from './PriceEditModal';
import CoachProfileModal from './CoachProfileModal';
import AddCoachNoteModal from './AddCoachNoteModal';
import StudentInfoModal from './StudentInfoModal';

export default function AdminCoaches() {
  const { coaches, students, deleteCoach } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCoachId, setEditCoachId] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [expandedCoachId, setExpandedCoachId] = useState<string | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showCoachProfile, setShowCoachProfile] = useState<string | null>(null);
  const [showAddNote, setShowAddNote] = useState<string | null>(null);
  const [showStudentInfo, setShowStudentInfo] = useState<string | null>(null);

  const getCoachStudents = (coachId: string) => {
    return students.filter(student => student.coachId === coachId);
  };

  const hasUnpaidStudents = (coachId: string) => {
    return getCoachStudents(coachId).some(student => !student.hasPaid);
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  const handleDeleteCoach = (coachId: string) => {
    if (confirm('Bu koçu silmek istediğinizden emin misiniz? Koça ait tüm öğrenciler de silinecektir.')) {
      deleteCoach(coachId);
      setSelectedCoachId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Koçlar</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPriceModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span>Fiyat Düzenle</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Koç Ekle</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sıralama
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coaches.map((coach) => {
                const coachStudents = getCoachStudents(coach.id);
                const isExpanded = expandedCoachId === coach.id;
                
                return (
                  <React.Fragment key={coach.id}>
                    <tr 
                      className={`cursor-pointer hover:bg-gray-50 ${
                        hasUnpaidStudents(coach.id) ? 'bg-red-50' : ''
                      }`}
                      onClick={() => setExpandedCoachId(isExpanded ? null : coach.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative mr-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCoachId(
                                  selectedCoachId === coach.id ? null : coach.id
                                );
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {selectedCoachId === coach.id && (
                              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditCoachId(coach.id);
                                      setSelectedCoachId(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                  >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Düzenle
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowCoachProfile(coach.id);
                                      setSelectedCoachId(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Profil
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAddNote(coach.id);
                                      setSelectedCoachId(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Not Ekle
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCoach(coach.id);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Sil
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <img
                            src={coach.profilePhoto || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={coach.firstName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {coach.firstName} {coach.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{coach.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{coachStudents.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getFieldName(coach.field)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coach.ranking}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(coach.registeredDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Actions moved to left of profile photo */}
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-900">Öğrenciler:</h4>
                            {coachStudents.length === 0 ? (
                              <p className="text-sm text-gray-500">Henüz öğrenci atanmamış</p>
                            ) : (
                              <div className="space-y-1">
                                {coachStudents.map((student) => (
                                  <div 
                                    key={student.id}
                                    className={`flex items-center justify-between text-sm p-2 rounded ${
                                      !student.hasPaid ? 'bg-red-100 text-red-800' : 'text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="relative">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowStudentInfo(student.id);
                                          }}
                                          className="text-gray-400 hover:text-gray-600"
                                        >
                                          <MoreVertical className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <span>{student.firstName} {student.lastName}</span>
                                      <span className="text-xs">({getFieldName(student.field)})</span>
                                      {!student.hasPaid && (
                                        <span className="text-xs bg-red-200 px-2 py-1 rounded">
                                          Ödeme Bekliyor
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddCoachModal onClose={() => setShowAddModal(false)} />
      )}

      {showPriceModal && (
        <PriceEditModal onClose={() => setShowPriceModal(false)} />
      )}

      {showCoachProfile && (
        <CoachProfileModal
          coachId={showCoachProfile}
          onClose={() => setShowCoachProfile(null)}
        />
      )}

      {showAddNote && (
        <AddCoachNoteModal
          coachId={showAddNote}
          onClose={() => setShowAddNote(null)}
        />
      )}

      {showStudentInfo && (
        <StudentInfoModal
          studentId={showStudentInfo}
          onClose={() => setShowStudentInfo(null)}
        />
      )}

      {editCoachId && (
        <EditCoachModal
          coachId={editCoachId}
          onClose={() => setEditCoachId(null)}
        />
      )}
    </div>
  );
}