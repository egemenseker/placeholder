import React, { useState } from 'react';
import { User, Users, Calendar, LogOut, ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import CoachProfile from './CoachProfile';
import CoachStudents from './CoachStudents';
import ProgramCreator from './ProgramCreator';

interface CoachPanelProps {
  onBack: () => void;
}

export default function CoachPanel({ onBack }: CoachPanelProps) {
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'students' | 'programs'>('profile');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    onBack();
  };

  if (selectedStudentId) {
    return (
      <ProgramCreator
        studentId={selectedStudentId}
        onBack={() => setSelectedStudentId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Koç Paneli</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Öğrenciler</span>
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'programs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Program Oluştur</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <CoachProfile />}
        {activeTab === 'students' && (
          <CoachStudents onCreateProgram={(studentId) => setSelectedStudentId(studentId)} />
        )}
      </div>
    </div>
  );
}