import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, MoreVertical, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useApp } from '../../contexts/AppContext';
import { Task, DayProgram } from '../../types';

interface ProgramCreatorProps {
  studentId: string;
  onBack: () => void;
}

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// Helper function to get Monday of current week
const getMondayOfWeek = (date: Date): Date => {
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  monday.setHours(0, 0, 0, 0); // Normalize to midnight
  return monday;
};

export default function ProgramCreator({ studentId, onBack }: ProgramCreatorProps) {
  const { students, programs, addProgram, updateProgram, user } = useApp();
  const student = students?.find(s => s.id === studentId);
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMondayOfWeek(new Date()));
  const [days, setDays] = useState<DayProgram[]>([]);
  const [selectedTask, setSelectedTask] = useState<{ dayIndex: number; taskId: string } | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Initialize empty week
  const initializeEmptyWeek = (weekStart: Date): DayProgram[] => {
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        date: date.toISOString().split('T')[0],
        dayName: dayNames[i],
        tasks: []
      };
    });
  };

  // Get current week program
  const getCurrentWeekProgram = () => {
    if (!programs || !user?.coachId) return null;
    return programs.find(p => 
      p.studentId === studentId && 
      p.coachId === user.coachId && 
      p.weekStart === currentWeekStart.toISOString().split('T')[0]
    );
  };

  // Check if viewing current week
  const isCurrentWeek = () => {
    const today = getMondayOfWeek(new Date());
    return currentWeekStart.toDateString() === today.toDateString();
  };

  // Load program data when week changes
  useEffect(() => {
    const existingProgram = getCurrentWeekProgram();
    
    if (existingProgram && existingProgram.days) {
      setDays(existingProgram.days);
    } else {
      setDays(initializeEmptyWeek(currentWeekStart));
    }
  }, [currentWeekStart, programs, studentId, user?.coachId]);

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
        ? { ...day, tasks: [...(day.tasks || []), newTask] }
        : day
    ));
  };

  const updateTask = (dayIndex: number, taskId: string, updates: Partial<Task>) => {
    setDays(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            tasks: (day.tasks || []).map(task => 
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
          ? { ...day, tasks: (day.tasks || []).filter(task => task.id !== taskId) }
          : day
      ));
      setSelectedTask(null);
    }
  };

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    const currentTask = days[dayIndex]?.tasks?.find(t => t.id === taskId);
    if (currentTask) {
      updateTask(dayIndex, taskId, { completed: !currentTask.completed });
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const saveProgram = async () => {
    if (!user?.coachId || !student) return;
    
    try {
      const existingProgram = getCurrentWeekProgram();
      
      if (existingProgram) {
        // Update existing program
        await updateProgram(existingProgram.id, { days });
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
        
        await addProgram(program);
        alert('Program başarıyla kaydedildi!');
      }
    } catch (error) {
      console.error('Program kaydetme hatası:', error);
      alert('Program kaydedilirken bir hata oluştu!');
    }
  };

  const exportToPDF = () => {
    if (!student) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, maxWidth?: number, fontSize = 10) => {
        doc.setFontSize(fontSize);
        if (maxWidth) {
          const lines = doc.splitTextToSize(text, maxWidth);
          doc.text(lines, x, y);
          return y + (lines.length * fontSize * 0.4);
        } else {
          doc.text(text, x, y);
          return y + (fontSize * 0.4);
        }
      };

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      yPosition = addText('Haftalık Çalışma Programı', margin, yPosition, undefined, 18);
      yPosition += 10;

      // Student and week info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(`Öğrenci: ${student.firstName} ${student.lastName}`, margin, yPosition, undefined, 12);
      yPosition += 5;
      yPosition = addText(`Hafta: ${currentWeekStart.toLocaleDateString('tr-TR')} - ${addDays(currentWeekStart, 6).toLocaleDateString('tr-TR')}`, margin, yPosition, undefined, 12);
      yPosition += 5;
      yPosition = addText(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, margin, yPosition, undefined, 12);
      yPosition += 15;

      // Days and tasks
      (days || []).forEach((day, dayIndex) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }

        // Day header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        yPosition = addText(`${day.dayName} - ${new Date(day.date).toLocaleDateString('tr-TR')}`, margin, yPosition, undefined, 14);
        yPosition += 8;

        // Tasks
        if (!day.tasks || day.tasks.length === 0) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          yPosition = addText('Görev bulunmuyor', margin + 10, yPosition, undefined, 10);
          yPosition += 8;
        } else {
          day.tasks.forEach((task, taskIndex) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            // Task status symbol
            const statusSymbol = task.completed ? '✓' : '○';
            doc.text(statusSymbol, margin + 5, yPosition);
            
            // Task details
            let taskText = task.name || 'İsimsiz Görev';
            if (task.courseName) {
              taskText += ` (${task.courseName})`;
            }
            if (task.duration) {
              taskText += ` - ${task.duration}`;
            }
            
            yPosition = addText(taskText, margin + 15, yPosition, pageWidth - margin - 25, 10);
            yPosition += 3;
          });
        }
        yPosition += 8;
      });

      // Statistics
      if (yPosition > 220) {
        doc.addPage();
        yPosition = margin;
      }

      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText('Program İstatistikleri', margin, yPosition, undefined, 12);
      yPosition += 8;

      const totalTasks = (days || []).reduce((total, day) => total + (day.tasks?.length || 0), 0);
      const completedTasks = (days || []).reduce((total, day) => 
        total + (day.tasks?.filter(task => task.completed).length || 0), 0
      );
      const incompleteTasks = totalTasks - completedTasks;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(`Toplam Görev: ${totalTasks}`, margin + 10, yPosition, undefined, 10);
      yPosition += 5;
      yPosition = addText(`Tamamlanan: ${completedTasks}`, margin + 10, yPosition, undefined, 10);
      yPosition += 5;
      yPosition = addText(`Tamamlanmayan: ${incompleteTasks}`, margin + 10, yPosition, undefined, 10);
      
      if (totalTasks > 0) {
        const completionRate = Math.round((completedTasks / totalTasks) * 100);
        yPosition += 5;
        yPosition = addText(`Tamamlanma Oranı: %${completionRate}`, margin + 10, yPosition, undefined, 10);
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Sayfa ${i} / ${pageCount}`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10);
        doc.text('Arı Koçluk - Haftalık Program', margin, doc.internal.pageSize.getHeight() - 10);
      }

      // Save the PDF
      const fileName = `${student.firstName}_${student.lastName}_Program_${currentWeekStart.toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      alert('Program PDF olarak başarıyla indirildi!');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu!');
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Öğrenci bulunamadı!</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const existingProgram = getCurrentWeekProgram();

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
                {existingProgram ? 'Güncelle' : 'Kaydet'}
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
                addDays(currentWeekStart, 6).toLocaleDateString('tr-TR')
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

        {/* Program Status Indicator */}
        <div className="mb-4">
          {existingProgram ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                ✅ Bu hafta için program mevcut - Düzenleyebilirsiniz
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                📝 Bu hafta için yeni program oluşturuluyor
              </p>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {(days || []).map((day, dayIndex) => (
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
                  onClick={() => setIsReviewMode(!isReviewMode)}
                  className={`p-2 rounded-full transition-colors ${
                    isReviewMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title="İnceleme Modu"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {(day.tasks || []).map((task) => (
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
                          value={task.name || ''}
                          onChange={(e) => updateTask(dayIndex, task.id, { name: e.target.value })}
                          placeholder="Görev adı"
                          className="w-full text-sm font-medium bg-transparent border-none focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={task.duration || ''}
                          onChange={(e) => updateTask(dayIndex, task.id, { duration: e.target.value })}
                          placeholder="Süre"
                          className="w-full text-xs text-gray-600 bg-transparent border-none focus:outline-none mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={task.courseName || ''}
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
                
                {(!day.tasks || day.tasks.length === 0) && (
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