import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AddCoachNoteModalProps {
  coachId: string;
  onClose: () => void;
}

export default function AddCoachNoteModal({ coachId, onClose }: AddCoachNoteModalProps) {
  const { coaches, updateCoach } = useApp();
  const coach = coaches.find(c => c.id === coachId);
  const [newNote, setNewNote] = useState('');

  if (!coach) return null;

  const handleSaveNote = () => {
    if (!newNote.trim()) {
      alert('Lütfen bir not giriniz.');
      return;
    }

    const currentNotes = coach.adminNotes || '';
    const timestamp = new Date().toLocaleString('tr-TR');
    const noteWithTimestamp = `[${timestamp}] ${newNote}`;
    const updatedNotes = currentNotes 
      ? `${currentNotes}\n\n${noteWithTimestamp}`
      : noteWithTimestamp;

    updateCoach(coachId, { adminNotes: updatedNotes });
    alert('Not başarıyla eklendi!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {coach.firstName} {coach.lastName} - Not Ekle
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Not:</strong> Bu not sadece adminler tarafından görülebilir. Koç bu nota erişemez.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notu
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bu koç hakkında notunuzu buraya yazın..."
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
              onClick={handleSaveNote}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Notu Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}