import React from 'react';
import { X, User, Phone, BookOpen, CreditCard, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface StudentInfoModalProps {
  studentId: string;
  onClose: () => void;
}

export default function StudentInfoModal({ studentId, onClose }: StudentInfoModalProps) {
  const { students, coaches } = useApp();
  const student = students.find(s => s.id === studentId);
  const coach = coaches.find(c => c.id === student?.coachId);

  if (!student) return null;

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Öğrenci Bilgileri</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Student Basic Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-gray-600">Öğrenci</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Alan</p>
                    <p className="font-medium">{getFieldName(student.field)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Ödeme Durumu</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.hasPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.hasPaid ? 'Ödendi' : 'Ödenmedi'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Koç</p>
                    <p className="font-medium">
                      {coach ? `${coach.firstName} ${coach.lastName}` : 'Atanmamış'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Notes */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Koç Notları</h4>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                {student.notes ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{student.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">Henüz koç notu eklenmemiş.</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Ek Bilgiler</h4>
              <p className="text-sm text-gray-600">
                <strong>Kayıt Tarihi:</strong> {new Date(student.registeredDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
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