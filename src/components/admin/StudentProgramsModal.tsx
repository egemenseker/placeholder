import React from 'react';
import { X, Calendar, Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface StudentProgramsModalProps {
  studentId: string;
  onClose: () => void;
}

export default function StudentProgramsModal({ studentId, onClose }: StudentProgramsModalProps) {
  const { students, coaches, programs } = useApp();
  const student = students.find(s => s.id === studentId);
  const studentPrograms = programs.filter(p => p.studentId === studentId);

  if (!student) return null;

  const getCoachName = (coachId: string) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? `${coach.firstName} ${coach.lastName}` : 'Bilinmeyen Koç';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {student.firstName} {student.lastName} - Geçmiş Programları
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {studentPrograms.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Henüz Program Oluşturulmamış
              </h3>
              <p className="text-gray-600">
                Bu öğrenci için henüz hiç program oluşturulmamış.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {studentPrograms.map((program) => (
                <div key={program.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Hafta: {new Date(program.weekStart).toLocaleDateString('tr-TR')} - {
                          new Date(new Date(program.weekStart).getTime() + 6 * 24 * 60 * 60 * 1000)
                            .toLocaleDateString('tr-TR')
                        }
                      </h3>
                      <p className="text-sm text-gray-600">
                        Koç: {getCoachName(program.coachId)} | 
                        Oluşturulma: {new Date(program.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                    {program.days.map((day, dayIndex) => (
                      <div key={dayIndex} className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-900 mb-2 text-center">
                          {day.dayName}
                        </h4>
                        <p className="text-xs text-gray-500 text-center mb-3">
                          {new Date(day.date).toLocaleDateString('tr-TR')}
                        </p>

                        <div className="space-y-2">
                          {day.tasks.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-2">
                              Görev yok
                            </p>
                          ) : (
                            day.tasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-2 rounded text-xs border ${
                                  task.completed 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-red-50 border-red-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium truncate">
                                    {task.name || 'İsimsiz Görev'}
                                  </span>
                                  {task.completed ? (
                                    <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-red-600 flex-shrink-0" />
                                  )}
                                </div>
                                {task.courseName && (
                                  <div className="flex items-center space-x-1 text-gray-600">
                                    <BookOpen className="w-3 h-3" />
                                    <span className="truncate">{task.courseName}</span>
                                  </div>
                                )}
                                {task.duration && (
                                  <div className="flex items-center space-x-1 text-gray-600 mt-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{task.duration}</span>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Program Statistics */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {program.days.reduce((total, day) => total + day.tasks.length, 0)}
                        </p>
                        <p className="text-sm text-gray-600">Toplam Görev</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {program.days.reduce((total, day) => 
                            total + day.tasks.filter(task => task.completed).length, 0
                          )}
                        </p>
                        <p className="text-sm text-gray-600">Tamamlanan</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {program.days.reduce((total, day) => 
                            total + day.tasks.filter(task => !task.completed).length, 0
                          )}
                        </p>
                        <p className="text-sm text-gray-600">Tamamlanmayan</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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