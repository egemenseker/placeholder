import React, { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, User, UserCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import AssignCoachModal from './AssignCoachModal';

export default function AdminStudents() {
  const { students, coaches, deleteStudent } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [assignStudentId, setAssignStudentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const getCoachName = (coachId: string) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? `${coach.firstName} ${coach.lastName}` : 'Atanmamış';
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      deleteStudent(studentId);
      setSelectedStudentId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Öğrenciler</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Öğrenci Ekle</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme Durumu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr 
                  key={student.id}
                  className={`hover:bg-gray-50 ${!student.hasPaid ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getCoachName(student.coachId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getFieldName(student.field)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.hasPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.hasPaid ? 'Ödendi' : 'Ödenmedi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.registeredDate).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setSelectedStudentId(
                          selectedStudentId === student.id ? null : student.id
                        )}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {selectedStudentId === student.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setEditStudentId(student.id);
                                setSelectedStudentId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Düzenle
                            </button>
                            <button
                              onClick={() => {
                                setAssignStudentId(student.id);
                                setSelectedStudentId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Koç Ata
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Sil
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} />
      )}

      {editStudentId && (
        <EditStudentModal
          studentId={editStudentId}
          onClose={() => setEditStudentId(null)}
        />
      )}

      {assignStudentId && (
        <AssignCoachModal
          studentId={assignStudentId}
          onClose={() => setAssignStudentId(null)}
        />
      )}
    </div>
  );
}