import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface StudentNotesModalProps {
  studentId: string;
  onClose: () => void;
}

export default function StudentNotesModal({ studentId, onClose }: StudentNotesModalProps) {
  const { students, updateStudent } = useApp();
  const student = students.find(s => s.id === studentId);
  const [notes, setNotes] = useState(student?.notes || '');

  const handleSave = () => {
    if (student) {
      updateStudent(student.id, { notes });
      alert('Notlar kaydedildi!');
      onClose();
    }
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {student.firstName} {student.lastName} - Öğrenci Notları
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Öğrenci Hakkında Notlarınız
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Öğrencinin güçlü/zayıf yanları, gelişim durumu, özel durumlar vb. notlarınızı buraya yazabilirsiniz..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}