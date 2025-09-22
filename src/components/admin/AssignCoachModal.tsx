import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AssignCoachModalProps {
  studentId: string;
  onClose: () => void;
}

export default function AssignCoachModal({ studentId, onClose }: AssignCoachModalProps) {
  const { students, coaches, assignStudentToCoach } = useApp();
  const student = students.find(s => s.id === studentId);
  const [selectedCoachId, setSelectedCoachId] = useState('');

  if (!student) return null;

  const availableCoaches = coaches
    .filter(coach => coach.field === student.field)
    .sort((a, b) => a.ranking - b.ranking);

  const handleAssign = () => {
    if (selectedCoachId) {
      assignStudentToCoach(studentId, selectedCoachId);
      alert('Öğrenci başarıyla koça atandı!');
      onClose();
    }
  };

  const getFieldName = (field: string) => {
    const fieldNames = { SAY: 'Sayısal', EA: 'Eşit Ağırlık', SÖZ: 'Sözel', DİL: 'Dil' };
    return fieldNames[field as keyof typeof fieldNames] || field;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Koç Ata</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              Alan: {getFieldName(student.field)}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Koç Seçin
            </label>
            <select
              value={selectedCoachId}
              onChange={(e) => setSelectedCoachId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Koç seçiniz</option>
              {availableCoaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.firstName} {coach.lastName} (Sıralama: {coach.ranking})
                </option>
              ))}
            </select>
            
            {availableCoaches.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Bu alan için uygun koç bulunamadı.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedCoachId}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Ata</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}