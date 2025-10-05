import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, MoreVertical, Trash2, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
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
      // Create a printable version of the current view
      const printElement = createPrintableElement();
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${student.firstName}_${student.lastName}_Program_${currentWeekStart.toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      html2pdf().set(opt).from(printElement).save().then(() => {
        alert('Program PDF olarak başarıyla indirildi!');
        // Clean up the temporary element
        document.body.removeChild(printElement);
      });
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu!');
    }
  };

  const createPrintableElement = () => {
    const printDiv = document.createElement('div');
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.top = '0';
    printDiv.style.width = '210mm'; // A4 width
    printDiv.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
    
    const totalTasks = (days || []).reduce((total, day) => total + (day.tasks?.length || 0), 0);
    const completedTasks = (days || []).reduce((total, day) => 
      total + (day.tasks?.filter(task => task.completed).length || 0), 0
    );
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    printDiv.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 12mm; 
          }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            color-adjust: exact !important;
          }
        }
        
        .print-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: white;
          padding: 20px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #FFBF00;
          padding-bottom: 20px;
        }
        
        .print-title {
          font-size: 28px;
          font-weight: 700;
          color: #2D2D2D;
          margin-bottom: 10px;
        }
        
        .print-subtitle {
          font-size: 16px;
          color: #666;
          margin: 5px 0;
        }
        
        .print-week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
          margin-bottom: 30px;
        }
        
        .print-day-card {
          background: linear-gradient(135deg, #FFFEF7 0%, #FAF9F2 100%);
          border: 2px solid #FFBF00;
          border-radius: 12px;
          padding: 16px;
          min-height: 300px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .print-day-header {
          text-align: center;
          margin-bottom: 16px;
          border-bottom: 1px solid #FFBF00;
          padding-bottom: 8px;
        }
        
        .print-day-name {
          font-size: 16px;
          font-weight: 700;
          color: #2D2D2D;
          margin-bottom: 4px;
        }
        
        .print-day-date {
          font-size: 12px;
          color: #666;
        }
        
        .print-task {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .print-task.completed {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-color: #22c55e;
        }
        
        .print-task-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        
        .print-task-name {
          font-weight: 600;
          color: #2D2D2D;
          font-size: 14px;
          flex: 1;
        }
        
        .print-task-status {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .print-task-status.completed {
          background: #22c55e;
          color: white;
        }
        
        .print-task-status.pending {
          background: #e5e5e5;
          color: #666;
        }
        
        .print-task-details {
          font-size: 12px;
          color: #666;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .print-task-detail {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .print-no-tasks {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 20px;
        }
        
        .print-statistics {
          background: linear-gradient(135deg, #FFFEF7 0%, #FAF9F2 100%);
          border: 2px solid #FFBF00;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .print-stats-title {
          font-size: 18px;
          font-weight: 700;
          color: #2D2D2D;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .print-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          text-align: center;
        }
        
        .print-stat-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .print-stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #FFBF00;
          margin-bottom: 5px;
        }
        
        .print-stat-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
        
        .print-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          color: #666;
          font-size: 12px;
        }
      </style>
      
      <div class="print-container">
        <div class="print-header">
          <div class="print-title">Haftalık Çalışma Programı</div>
          <div class="print-subtitle">Öğrenci: ${student.firstName} ${student.lastName}</div>
          <div class="print-subtitle">Hafta: ${currentWeekStart.toLocaleDateString('tr-TR')} - ${addDays(currentWeekStart, 6).toLocaleDateString('tr-TR')}</div>
          <div class="print-subtitle">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
        </div>
        
        <div class="print-week-grid">
          ${(days || []).map(day => `
            <div class="print-day-card">
              <div class="print-day-header">
                <div class="print-day-name">${day.dayName}</div>
                <div class="print-day-date">${new Date(day.date).toLocaleDateString('tr-TR')}</div>
              </div>
              
              ${!day.tasks || day.tasks.length === 0 ? 
                '<div class="print-no-tasks">Görev bulunmuyor</div>' :
                day.tasks.map(task => `
                  <div class="print-task ${task.completed ? 'completed' : ''}">
                    <div class="print-task-header">
                      <div class="print-task-name">${task.name || 'İsimsiz Görev'}</div>
                      <div class="print-task-status ${task.completed ? 'completed' : 'pending'}">
                        ${task.completed ? '✓' : '○'}
                      </div>
                    </div>
                    <div class="print-task-details">
                      ${task.courseName ? `<div class="print-task-detail">📚 ${task.courseName}</div>` : ''}
                      ${task.duration ? `<div class="print-task-detail">⏱ ${task.duration}</div>` : ''}
                    </div>
                  </div>
                `).join('')
              }
            </div>
          `).join('')}
        </div>
        
        <div class="print-statistics">
          <div class="print-stats-title">Program İstatistikleri</div>
          <div class="print-stats-grid">
            <div class="print-stat-item">
              <div class="print-stat-number">${totalTasks}</div>
              <div class="print-stat-label">Toplam Görev</div>
            </div>
            <div class="print-stat-item">
              <div class="print-stat-number">${completedTasks}</div>
              <div class="print-stat-label">Tamamlanan</div>
            </div>
            <div class="print-stat-item">
              <div class="print-stat-number">${totalTasks - completedTasks}</div>
              <div class="print-stat-label">Tamamlanmayan</div>
            </div>
            <div class="print-stat-item">
              <div class="print-stat-number">%${completionRate}</div>
              <div class="print-stat-label">Tamamlanma Oranı</div>
            </div>
          </div>
        </div>
        
        <div class="print-footer">
          © 2025 Arı Koçluk - Haftalık Program
        </div>
      </div>
    `;
    
    document.body.appendChild(printDiv);
    return printDiv;
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