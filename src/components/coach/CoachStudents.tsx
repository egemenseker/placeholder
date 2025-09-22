import React, { useState } from 'react';
import { MoreVertical, User, Eye, Calendar, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StudentNotesModal from './StudentNotesModal';

interface CoachStudentsProps {
  onCreateProgram: (studentId: string) => void;
}

export default function CoachStudents({ onCreateProgram }: CoachStudentsProps) {
  const { user, students, coaches, programs } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<string | null>(null);

  const coachStudents = students.filter(student => student.coachId === user?.coachId);
  const currentCoach = coaches.find(c => c.id === user?.coachId);

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  const getStudentPrograms = (studentId: string) => {
    return programs.filter(p => p.studentId === studentId && p.coachId === user?.coachId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Öğrencilerim</h2>
        <div className="text-sm text-gray-600">
          Toplam {coachStudents.length} öğrenci
        </div>
      </div>

      {coachStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Henüz öğrenciniz bulunmuyor
          </h3>
          <p className="text-gray-600">
            Admin tarafından size öğrenci atandığında burada görünecektir.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Durumu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coachStudents.map((student) => (
                  <tr 
                    key={student.id}
                    className={`${!student.hasPaid ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <button
                            onClick={() => setSelectedStudentId(
                              selectedStudentId === student.id ? null : student.id
                            )}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {selectedStudentId === student.id && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setShowNotesModal(student.id);
                                    setSelectedStudentId(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Notlar
                                </button>
                                <button
                                  onClick={() => {
                                    onCreateProgram(student.id);
                                    setSelectedStudentId(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Program Oluştur
                                </button>
                                <button
                                  onClick={() => {
                                    alert(`${student.firstName}'in geçmiş programları gösteriliyor...`);
                                    setSelectedStudentId(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Geçmiş Programlar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onCreateProgram(student.id)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Program Oluştur</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getFieldName(student.field)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.registeredDate).toLocaleDateString('tr-TR')}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNotesModal && (
        <StudentNotesModal
          studentId={showNotesModal}
          onClose={() => setShowNotesModal(null)}
        />
      )}
    </div>
  );
}