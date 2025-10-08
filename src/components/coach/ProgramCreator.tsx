import React, { useState, useEffect, useRef } from 'react';
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

// Helper function to format date as YYYY-MM-DD in local timezone
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to normalize date to midnight
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Helper function to check if a date falls within a range (inclusive)
const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  const normalizedDate = normalizeDate(date);
  const normalizedStart = normalizeDate(startDate);
  const normalizedEnd = normalizeDate(endDate);
  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
};

// Helper function to get the canonical week start (Monday) for any given date
const getCanonicalWeekStart = (date: Date): Date => {
  const normalized = normalizeDate(date);
  const dayOfWeek = normalized.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return addDays(normalized, -daysToSubtract);
};

export default function ProgramCreator({ studentId, onBack }: ProgramCreatorProps) {
  const { students, programs, addProgram, updateProgram, user } = useApp();
  const student = students?.find(s => s.id === studentId);

  const exportRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [currentWindowStart, setCurrentWindowStart] = useState(() => normalizeDate(new Date()));
  const [days, setDays] = useState<DayProgram[]>([]);
  const [selectedTask, setSelectedTask] = useState<{ dayIndex: number; taskId: string } | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [taskReviewStates, setTaskReviewStates] = useState<Record<string, 'neutral' | 'completed' | 'failed'>>({});

  const getTaskVisualState = (dayIndex: number, task: Task): 'neutral' | 'completed' | 'failed' => {
    if (isReviewMode) {
      const taskKey = `${dayIndex}-${task.id}`;
      return taskReviewStates[taskKey] || task.status || 'neutral';
    }
    return task.status || (task.completed ? 'completed' : 'neutral');
  };

  const getTaskClasses = (visualState: 'neutral' | 'completed' | 'failed', reviewMode: boolean): string => {
    const baseClasses = 'border rounded-lg p-3 transition-all duration-200';
    let colorClasses = '';
    switch (visualState) {
      case 'completed':
        colorClasses = 'bg-green-100 border-green-300';
        break;
      case 'failed':
        colorClasses = 'bg-red-100 border-red-300';
        break;
      default:
        colorClasses = 'bg-white border-gray-200';
        break;
    }
    if (reviewMode) {
      const interactive = 'cursor-pointer hover:shadow-md';
      const hover =
        visualState === 'completed'
          ? 'hover:bg-green-200'
          : visualState === 'failed'
          ? 'hover:bg-red-200'
          : 'hover:bg-gray-50';
      return `${baseClasses} ${colorClasses} ${interactive} ${hover}`;
    }
    return `${baseClasses} ${colorClasses}`;
  };

  const handleTaskReviewToggle = (dayIndex: number, taskId: string) => {
    if (!isReviewMode) return;
    const taskKey = `${dayIndex}-${taskId}`;
    const currentState = taskReviewStates[taskKey] || 'neutral';
    let nextState: 'neutral' | 'completed' | 'failed';
    switch (currentState) {
      case 'neutral':
        nextState = 'completed';
        break;
      case 'completed':
        nextState = 'failed';
        break;
      default:
        nextState = 'neutral';
        break;
    }
    setTaskReviewStates(prev => ({ ...prev, [taskKey]: nextState }));
  };

  const initializeEmpty7DayWindow = (windowStart: Date): DayProgram[] => {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(windowStart, i);
      const dayOfWeek = date.getDay();
      const dayName = dayNames[dayOfWeek];
      return { date: formatLocalDate(date), dayName, tasks: [] };
    });
  };

  const getCurrentWindowProgram = () => {
    if (!programs || !user?.coachId) return null;
    return programs.find(
      p => p.studentId === studentId && p.coachId === user.coachId && p.weekStart === formatLocalDate(currentWindowStart),
    );
  };

  const isCurrentDay = () => {
    const today = normalizeDate(new Date());
    return currentWindowStart.toDateString() === today.toDateString();
  };

  useEffect(() => {
    const displayedDays = initializeEmpty7DayWindow(currentWindowStart);
    const displayWindowEnd = addDays(currentWindowStart, 6);

    if (programs && user?.coachId) {
      const relevantPrograms = programs.filter(p => p.studentId === studentId && p.coachId === user.coachId);
      relevantPrograms.forEach(program => {
        const programStart = new Date(program.weekStart);
        const programEnd = addDays(programStart, 6);
        const hasOverlap =
          isDateInRange(programStart, currentWindowStart, displayWindowEnd) ||
          isDateInRange(programEnd, currentWindowStart, displayWindowEnd) ||
          isDateInRange(currentWindowStart, programStart, programEnd) ||
          isDateInRange(displayWindowEnd, programStart, programEnd);

        if (hasOverlap && program.days) {
          program.days.forEach(programDay => {
            const programDayDate = new Date(programDay.date);
            if (isDateInRange(programDayDate, currentWindowStart, displayWindowEnd)) {
              const displayDayIndex = displayedDays.findIndex(d => d.date === formatLocalDate(programDayDate));
              if (displayDayIndex !== -1 && programDay.tasks) {
                displayedDays[displayDayIndex].tasks = [...programDay.tasks];
              }
            }
          });
        }
      });
    }

    setDays(displayedDays);

    const newTaskReviewStates: Record<string, 'neutral' | 'completed' | 'failed'> = {};
    displayedDays.forEach((day, dayIndex) => {
      day.tasks?.forEach(task => {
        const taskKey = `${dayIndex}-${task.id}`;
        newTaskReviewStates[taskKey] = task.status || (task.completed ? 'completed' : 'neutral');
      });
    });
    setTaskReviewStates(newTaskReviewStates);
  }, [currentWindowStart, programs, studentId, user?.coachId]);

  const addTask = (dayIndex: number) => {
    const newTask: Task = { id: Date.now().toString(), name: '', duration: '', courseName: '', completed: false };
    setDays(prev => prev.map((day, index) => (index === dayIndex ? { ...day, tasks: [...(day.tasks || []), newTask] } : day)));
  };

  const updateTask = (dayIndex: number, taskId: string, updates: Partial<Task>) => {
    setDays(prev =>
      prev.map((day, index) =>
        index === dayIndex ? { ...day, tasks: (day.tasks || []).map(t => (t.id === taskId ? { ...t, ...updates } : t)) } : day,
      ),
    );
  };

  const deleteTask = (dayIndex: number, taskId: string) => {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      setDays(prev =>
        prev.map((day, index) => (index === dayIndex ? { ...day, tasks: (day.tasks || []).filter(t => t.id !== taskId) } : day)),
      );
      setSelectedTask(null);
    }
  };

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    const currentTask = days[dayIndex]?.tasks?.find(t => t.id === taskId);
    if (currentTask) updateTask(dayIndex, taskId, { completed: !currentTask.completed });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentWindowStart(prev => addDays(prev, direction === 'next' ? 1 : -1));
  };

  const saveProgram = async (currentDays: DayProgram[] = days) => {
    if (!user?.coachId || !student) return;
    try {
      const programWeeksMap = new Map<string, DayProgram[]>();
      currentDays.forEach((day, originalDayIndex) => {
        const dayDate = new Date(day.date);
        const canonicalWeekStart = getCanonicalWeekStart(dayDate);
        const weekStartKey = formatLocalDate(canonicalWeekStart);
        if (!programWeeksMap.has(weekStartKey)) {
          const weekDays = initializeEmpty7DayWindow(canonicalWeekStart);
          programWeeksMap.set(weekStartKey, weekDays);
        }
        const weekDays = programWeeksMap.get(weekStartKey)!;
        const dayIndex = weekDays.findIndex(weekDay => weekDay.date === day.date);
        if (dayIndex !== -1) {
          const updatedTasks =
            day.tasks?.map(task => {
              const taskKey = `${originalDayIndex}-${task.id}`;
              const reviewState = taskReviewStates[taskKey];
              return { ...task, status: reviewState || task.status || 'neutral', completed: reviewState === 'completed' || (!reviewState && task.completed) };
            }) || [];
          weekDays[dayIndex] = { ...day, tasks: updatedTasks };
        }
      });

      const savePromises: Promise<void>[] = [];
      for (const [weekStartKey, weekDays] of programWeeksMap.entries()) {
        const existingProgram = programs?.find(p => p.studentId === studentId && p.coachId === user.coachId && p.weekStart === weekStartKey);
        if (existingProgram) {
          savePromises.push(updateProgram(existingProgram.id, { days: weekDays }));
        } else {
          const newProgram = { studentId, coachId: user.coachId, weekStart: weekStartKey, days: weekDays, createdAt: new Date().toISOString() };
          savePromises.push(addProgram(newProgram));
        }
      }
      await Promise.all(savePromises);
      const weekCount = programWeeksMap.size;
      alert(`Program başarıyla ${weekCount > 1 ? `${weekCount} hafta için ` : ''}kaydedildi!`);
    } catch (error) {
      console.error('Program kaydetme hatası:', error);
      alert('Program kaydedilirken bir hata oluştu!');
    }
  };

 const exportToPDF = async () => {
  if (!student || !pdfRef.current) return;
  const opt = {
    margin: [5, 5, 5, 5],
    filename: `${student.firstName}_${student.lastName}_Program_${formatLocalDate(currentWindowStart)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      foreignObjectRendering: true,
      logging: false,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true },
  } as const;

  await html2pdf().set(opt).from(pdfRef.current).save();
};
function ExportView({ days }: { days: DayProgram[] }) {
  return (
    <div
      ref={pdfRef}
      data-export-root
      style={{
        position: 'fixed', left: -99999, top: 0, width: 1400,
        background: '#fff', padding: 20, boxSizing: 'border-box'
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Haftalık Çalışma Programı</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 16 }}>
        {days.map((d, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{d.dayName}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{new Date(d.date).toLocaleDateString('tr-TR')}</div>
            </div>
            {(d.tasks || []).length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Henüz görev eklenmemiş</div>
            )}
            {(d.tasks || []).map(t => (
              <div key={t.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                  {t.name || ''}
                </div>
                <div style={{ fontSize: 12, color: '#4b5563', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                  {t.duration || ''}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                  {t.courseName || ''}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Öğrenci bulunamadı!</h2>
          <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const existingProgram = getCurrentWindowProgram();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Program Oluştur - {student.firstName} {student.lastName}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={exportToPDF} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>PDF İndir</span>
              </button>
              <button onClick={() => saveProgram(days)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {existingProgram ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">7 Günlük Program</h2>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateDay('prev')} className="p-2 rounded-lg border hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {currentWindowStart.toLocaleDateString('tr-TR')} - {addDays(currentWindowStart, 6).toLocaleDateString('tr-TR')}
            </span>
            <button onClick={() => navigateDay('next')} className="p-2 rounded-lg border hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Program Status Indicator */}
        <div className="mb-4">
          {(() => {
            const totalTasks = (days || []).reduce((total, day) => total + (day.tasks?.length || 0), 0);
            return totalTasks > 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">✅ Bu tarih aralığı için program mevcut - Düzenleyebilirsiniz</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">📝 Bu tarih aralığı için yeni program oluşturuluyor</p>
              </div>
            );
          })()}
        </div>

        {/* Calendar Grid */}
        <div ref={exportRef} data-export-root className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {(days || []).map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-lg shadow-md p-4">
              {/* Day Header */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">{day.dayName}</h3>
                <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('tr-TR')}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-2 mb-4">
                <button onClick={() => addTask(dayIndex)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" title="Görev Ekle">
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (isReviewMode) {
                      const updatedDays = days.map((d, dIdx) => ({
                        ...d,
                        tasks: d.tasks.map(task => {
                          const taskKey = `${dIdx}-${task.id}`;
                          const reviewState = taskReviewStates[taskKey] || 'neutral';
                          return { ...task, completed: reviewState === 'completed' };
                        }),
                      }));
                      setDays(updatedDays);
                      try {
                        await saveProgram(updatedDays);
                      } catch (error) {
                        console.error('Error saving program:', error);
                        alert('Program kaydedilirken bir hata oluştu!');
                      }
                      setTaskReviewStates({});
                    }
                    setIsReviewMode(!isReviewMode);
                  }}
                  className={`p-2 rounded-full transition-colors ${isReviewMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                  title="İnceleme Modu"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {(day.tasks || []).map(task => (
                  <div
                    key={task.id}
                    className={getTaskClasses(getTaskVisualState(dayIndex, task), isReviewMode)}
                    onClick={() => isReviewMode && handleTaskReviewToggle(dayIndex, task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <textarea
                          value={task.name || ''}
                          onChange={e => updateTask(dayIndex, task.id, { name: e.target.value })}
                          placeholder="Görev adı"
                          className="w-full text-sm font-medium bg-transparent border-none focus:outline-none resize-none overflow-hidden"
                          rows={1}
                          disabled={isReviewMode}
                          onClick={e => e.stopPropagation()}
                          onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          ref={el => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = el.scrollHeight + 'px';
                            }
                          }}
                        />
                        <textarea
                          value={task.duration || ''}
                          onChange={e => updateTask(dayIndex, task.id, { duration: e.target.value })}
                          placeholder="Süre"
                          className="w-full text-xs text-gray-600 bg-transparent border-none focus:outline-none mt-1 resize-none overflow-hidden"
                          rows={1}
                          disabled={isReviewMode}
                          onClick={e => e.stopPropagation()}
                          onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          ref={el => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = el.scrollHeight + 'px';
                            }
                          }}
                        />
                        <textarea
                          value={task.courseName || ''}
                          onChange={e => updateTask(dayIndex, task.id, { courseName: e.target.value })}
                          placeholder="Ders adı"
                          className="w-full text-xs text-gray-500 bg-transparent border-none focus:outline-none mt-1 resize-none overflow-hidden"
                          rows={1}
                          disabled={isReviewMode}
                          onClick={e => e.stopPropagation()}
                          onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          ref={el => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = el.scrollHeight + 'px';
                            }
                          }}
                        />
                      </div>

                      <div className="relative">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedTask(selectedTask?.taskId === task.id ? null : { dayIndex, taskId: task.id });
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {selectedTask?.taskId === task.id && (
                          <div className="absolute right-0 top-6 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                            <button
                              onClick={e => {
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

                {(!day.tasks || day.tasks.length === 0) && <div className="text-center text-gray-400 text-sm py-4">Henüz görev eklenmemiş</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    <ExportView days={days} />
    </div>

  );
}
