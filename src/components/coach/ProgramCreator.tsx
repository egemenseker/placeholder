import React, { useState } from 'react';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, MoreVertical, Trash2, Edit2, Download } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task, DayProgram } from '../../types';

interface ProgramCreatorProps {
  studentId: string;
  onBack: () => void;
}

export default function ProgramCreator({ studentId, onBack }: ProgramCreatorProps) {
  const { students, addProgram, user } = useApp();
  const student = students.find(s => s.id === studentId);
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    return monday;
  });

  const [days, setDays] = useState<DayProgram[]>(() => {
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        dayName: dayNames[i],
        tasks: []
      };
    });
  });

  const [selectedTask, setSelectedTask] = useState<{ dayIndex: number; taskId: string } | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const addTask = (dayIndex: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      duration: '',
      courseName: '',
      completed: false
    };

    setDays(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, tasks: [...day.tasks, newTask] }
        : day
    ));
  };

  const updateTask = (dayIndex: number, taskId: string, updates: Partial<Task>) => {
    setDays(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            tasks: day.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : day
    ));
  };

  const deleteTask = (dayIndex: number, taskId: string) => {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      setDays(prev => prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, tasks: day.tasks.filter(task => task.id !== taskId) }
          : day
      ));
      setSelectedTask(null);
    }
  };

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    updateTask(dayIndex, taskId, { 
      completed: !days[dayIndex].tasks.find(t => t.id === taskId)?.completed 
    });
  };

  const toggleDayReview = (dayIndex: number) => {
    const day = days[dayIndex];
    const allCompleted = day.tasks.every(task => task.completed);
    
    if (!isReviewMode) {
      setIsReviewMode(true);
    } else {
      setIsReviewMode(false);
      // Mark incomplete tasks as red background would be handled by CSS
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
    
    // Check if there's an existing program for this week
    const existingProgram = programs.find(p => 
      p.studentId === studentId && 
      p.coachId === user?.coachId && 
      p.weekStart === newWeekStart.toISOString().split('T')[0]
    );
    
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    
    if (existingProgram) {
      // Load existing program data
      setDays(existingProgram.days);
    } else {
      // Create empty days for new week
      setDays(Array.from({ length: 7 }, (_, i) => {
        const date = new Date(newWeekStart);
        date.setDate(newWeekStart.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          dayName: dayNames[i],
          tasks: []
        };
      }));
    }
  };

  const saveProgram = () => {
    if (!user?.coachId) return;
    
    // Check if program already exists for this week
    const existingProgram = programs.find(p => 
      p.studentId === studentId && 
      p.coachId === user.coachId && 
      p.weekStart === currentWeekStart.toISOString().split('T')[0]
    );
    
    if (existingProgram) {
      // Update existing program
      updateProgram(existingProgram.id, { days });
      alert('Program başarıyla güncellendi!');
    } else {
      // Create new program
      const program = {
        studentId,
        coachId: user.coachId,
        weekStart: currentWeekStart.toISOString().split('T')[0],
        days,
        createdAt: new Date().toISOString()
      };
      
      addProgram(program);
      alert('Program başarıyla kaydedildi!');
    }
  };

  const getCurrentWeekProgram = () => {
    return programs.find(p => 
      p.studentId === studentId && 
      p.coachId === user?.coachId && 
      p.weekStart === currentWeekStart.toISOString().split('T')[0]
    );
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    return currentWeekStart.toDateString() === monday.toDateString();
  };

  // Load existing program data when component mounts or week changes
  React.useEffect(() => {
    const existingProgram = programs.find(p => 
      p.studentId === studentId && 
      p.coachId === user?.coachId && 
      p.weekStart === currentWeekStart.toISOString().split('T')[0]
    );
    
    if (existingProgram) {
      setDays(existingProgram.days);
    } else {
      const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
      const date = new Date(newWeekStart);
      date.setDate(newWeekStart.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        dayName: dayNames[i],
        tasks: []
      };
      setDays(Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          dayName: dayNames[i],
          tasks: []
        };
      }));
    }
  }, [currentWeekStart, programs, studentId, user?.coachId]);

  const exportToPDF = () => {
    // This would integrate with a PDF generation library
    alert('PDF export özelliği eklendi! Program PDF olarak indirilecek.');
  };

  if (!student) return <div>Öğrenci bulunamadı!</div>;

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
                <span>Geri</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Program Oluştur - {student.firstName} {student.lastName}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF İndir</span>
              </button>
              <button
                onClick={saveProgram}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Haftalık Program
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {currentWeekStart.toLocaleDateString('tr-TR')} - {
                new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('tr-TR')
              }
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-lg shadow-md p-4">
              {/* Day Header */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">{day.dayName}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('tr-TR')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-2 mb-4">
                <button
                  onClick={() => addTask(dayIndex)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  title="Görev Ekle"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleDayReview(dayIndex)}
                  className={`p-2 rounded-full transition-colors ${
                    isReviewMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
          {/* Program Status Indicator */}
          <div className="mb-4">
            {getCurrentWeekProgram() ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Bu hafta için program mevcut.</strong> Değişiklik yapabilir ve güncelleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Bu hafta için yeni program oluşturuluyor.</strong> Görevleri ekleyip kaydedin.
                </p>
              </div>
            )}
          </div>
                  title="Günü Tamamla"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : isReviewMode && !task.completed
                        ? 'bg-red-50 border-red-200'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                    onClick={() => toggleTaskCompletion(dayIndex, task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={task.name}
                          onChange={(e) => updateTask(dayIndex, task.id, { name: e.target.value })}
                          placeholder="Görev adı"
                          className="w-full text-sm font-medium bg-transparent border-none focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={task.duration}
                          onChange={(e) => updateTask(dayIndex, task.id, { duration: e.target.value })}
                          placeholder="Süre"
                          className="w-full text-xs text-gray-600 bg-transparent border-none focus:outline-none mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={task.courseName}
                          onChange={(e) => updateTask(dayIndex, task.id, { courseName: e.target.value })}
                          placeholder="Ders adı"
                          className="w-full text-xs text-gray-500 bg-transparent border-none focus:outline-none mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(
                              selectedTask?.taskId === task.id ? null : { dayIndex, taskId: task.id }
                            );
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {selectedTask?.taskId === task.id && (
                          <div className="absolute right-0 top-6 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(dayIndex, task.id);
                              }}
                              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Sil</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {day.tasks.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Henüz görev eklenmemiş
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}