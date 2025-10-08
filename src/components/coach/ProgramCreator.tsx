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
  // Explicitly construct a new Date using local year, month, and day
  // This ensures we always get midnight in local timezone without any shifts
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
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6, others to dayOfWeek - 1
  return addDays(normalized, -daysToSubtract);
};

export default function ProgramCreator({ studentId, onBack }: ProgramCreatorProps) {
  const { students, programs, addProgram, updateProgram, user } = useApp();
  const student = students?.find(s => s.id === studentId);

  const exportRef = useRef<HTMLDivElement>(null);
  const [currentWindowStart, setCurrentWindowStart] = useState(() => normalizeDate(new Date()));
  const [days, setDays] = useState<DayProgram[]>([]);
  const [selectedTask, setSelectedTask] = useState<{ dayIndex: number; taskId: string } | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [taskReviewStates, setTaskReviewStates] = useState<Record<string, 'neutral' | 'completed' | 'failed'>>({});

  // Helper function to get the visual state of a task
  const getTaskVisualState = (dayIndex: number, task: Task): 'neutral' | 'completed' | 'failed' => {
    // In review mode, use the temporary review states
    if (isReviewMode) {
      const taskKey = `${dayIndex}-${task.id}`;
      return taskReviewStates[taskKey] || task.status || 'neutral';
    }
    // Not in review mode, always show the saved status
    return task.status || (task.completed ? 'completed' : 'neutral');
  };

  // Helper function to get CSS classes for a task based on its state
  const getTaskClasses = (visualState: 'neutral' | 'completed' | 'failed', reviewMode: boolean): string => {
    const baseClasses = 'border rounded-lg p-3 transition-all duration-200';

    // Always show colors regardless of review mode
    let colorClasses = '';
    switch (visualState) {
      case 'completed':
        colorClasses = 'bg-green-100 border-green-300';
        break;
      case 'failed':
        colorClasses = 'bg-red-100 border-red-300';
        break;
      case 'neutral':
      default:
        colorClasses = 'bg-white border-gray-200';
        break;
    }

    // Only add interactive classes when in review mode
    if (reviewMode) {
      const interactiveClasses = 'cursor-pointer hover:shadow-md';
      const hoverEffect = visualState === 'completed' ? 'hover:bg-green-200' :
                          visualState === 'failed' ? 'hover:bg-red-200' : 'hover:bg-gray-50';
      return `${baseClasses} ${colorClasses} ${interactiveClasses} ${hoverEffect}`;
    }

    return `${baseClasses} ${colorClasses}`;
  };

  // Helper function to handle task click in review mode
  const handleTaskReviewToggle = (dayIndex: number, taskId: string) => {
    if (!isReviewMode) return;

    const taskKey = `${dayIndex}-${taskId}`;
    const currentState = taskReviewStates[taskKey] || 'neutral';

    // Cycle order: neutral (white) → completed (green) → failed (red) → neutral (white)
    let nextState: 'neutral' | 'completed' | 'failed';
    switch (currentState) {
      case 'neutral':
        nextState = 'completed';
        break;
      case 'completed':
        nextState = 'failed';
        break;
      case 'failed':
        nextState = 'neutral';
        break;
      default:
        nextState = 'neutral';
    }

    setTaskReviewStates(prev => ({
      ...prev,
      [taskKey]: nextState
    }));
  };

  // Initialize empty 7-day window
  const initializeEmpty7DayWindow = (windowStart: Date): DayProgram[] => {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(windowStart, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const dayName = dayNames[dayOfWeek]; // Direct mapping now that array starts with Sunday
      return {
        date: formatLocalDate(date),
        dayName: dayName,
        tasks: []
      };
    });
  };

  // Get current window program
  const getCurrentWindowProgram = () => {
    if (!programs || !user?.coachId) return null;
    return programs.find(p => 
      p.studentId === studentId && 
      p.coachId === user.coachId && 
      p.weekStart === formatLocalDate(currentWindowStart)
    );
  };

  // Check if viewing current day
  const isCurrentDay = () => {
    const today = normalizeDate(new Date());
    return currentWindowStart.toDateString() === today.toDateString();
  };

  // Load program data when window changes
  useEffect(() => {
    // Initialize empty 7-day window
    const displayedDays = initializeEmpty7DayWindow(currentWindowStart);

    // Calculate the end date of the current display window
    const displayWindowEnd = addDays(currentWindowStart, 6);

    // Find all programs that overlap with the current display window
    if (programs && user?.coachId) {
      const relevantPrograms = programs.filter(p =>
        p.studentId === studentId &&
        p.coachId === user.coachId
      );

      // For each relevant program, check if it overlaps with our display window
      relevantPrograms.forEach(program => {
        const programStart = new Date(program.weekStart);
        const programEnd = addDays(programStart, 6);

        // Check if this program's week overlaps with our display window
        const hasOverlap = isDateInRange(programStart, currentWindowStart, displayWindowEnd) ||
                          isDateInRange(programEnd, currentWindowStart, displayWindowEnd) ||
                          isDateInRange(currentWindowStart, programStart, programEnd) ||
                          isDateInRange(displayWindowEnd, programStart, programEnd);

        if (hasOverlap && program.days) {
          // Merge tasks from overlapping program days into our display
          program.days.forEach(programDay => {
            const programDayDate = new Date(programDay.date);

            // Check if this specific day falls within our display window
            if (isDateInRange(programDayDate, currentWindowStart, displayWindowEnd)) {
              // Find the corresponding day in our display window
              const displayDayIndex = displayedDays.findIndex(displayDay =>
                displayDay.date === formatLocalDate(programDayDate)
              );

              if (displayDayIndex !== -1 && programDay.tasks) {
                // Merge tasks into the display day
                displayedDays[displayDayIndex].tasks = [...programDay.tasks];
              }
            }
          });
        }
      });
    }

    setDays(displayedDays);

    // Initialize task review states when data loads
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

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentWindowStart(prev => addDays(prev, direction === 'next' ? 1 : -1));
  };

  const saveProgram = async (currentDays: DayProgram[] = days) => {
    if (!user?.coachId || !student) return;

    try {
      // Group days by their canonical week start
      const programWeeksMap = new Map<string, DayProgram[]>();

      // Process each day in the current display
      currentDays.forEach((day, originalDayIndex) => {
        const dayDate = new Date(day.date);
        const canonicalWeekStart = getCanonicalWeekStart(dayDate);
        const weekStartKey = formatLocalDate(canonicalWeekStart);

        if (!programWeeksMap.has(weekStartKey)) {
          // Initialize a complete 7-day week starting from canonical Monday
          const weekDays = initializeEmpty7DayWindow(canonicalWeekStart);
          programWeeksMap.set(weekStartKey, weekDays);
        }

        // Find the correct day index within the canonical week
        const weekDays = programWeeksMap.get(weekStartKey)!;
        const dayIndex = weekDays.findIndex(weekDay => weekDay.date === day.date);

        if (dayIndex !== -1) {
          // Update tasks with their review states before saving
          const updatedTasks = day.tasks?.map(task => {
            const taskKey = `${originalDayIndex}-${task.id}`;
            const reviewState = taskReviewStates[taskKey];
            return {
              ...task,
              status: reviewState || task.status || 'neutral',
              completed: reviewState === 'completed' || (!reviewState && task.completed)
            };
          }) || [];

          // Update the day with current tasks
          weekDays[dayIndex] = { ...day, tasks: updatedTasks };
        }
      });
      
      // Save each program week
      const savePromises: Promise<void>[] = [];
      
      for (const [weekStartKey, weekDays] of programWeeksMap.entries()) {
        // Check if a program already exists for this week
        const existingProgram = programs?.find(p => 
          p.studentId === studentId && 
          p.coachId === user.coachId && 
          p.weekStart === weekStartKey
        );
        
        if (existingProgram) {
          // Update existing program
          savePromises.push(updateProgram(existingProgram.id, { days: weekDays }));
        } else {
          // Create new program
          const newProgram = {
            studentId,
            coachId: user.coachId,
            weekStart: weekStartKey,
            days: weekDays,
            createdAt: new Date().toISOString()
          };
          savePromises.push(addProgram(newProgram));
        }
      }
      
      // Wait for all save operations to complete
      await Promise.all(savePromises);
      
      const weekCount = programWeeksMap.size;
      alert(`Program başarıyla ${weekCount > 1 ? `${weekCount} hafta için ` : ''}kaydedildi!`);
    } catch (error) {
      console.error('Program kaydetme hatası:', error);
      alert('Program kaydedilirken bir hata oluştu!');
    }
  };

 const exportToPDF = async () => {
  if (!student || !exportRef.current) return;

  try {
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `${student.firstName}_${student.lastName}_Program_${formatLocalDate(currentWindowStart)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
       onclone: (clonedDoc: Document) => {
  const root = clonedDoc.querySelector('[data-export-root]') as HTMLElement | null;
  if (!root) return;

  // PDF düzeni için güvenli kap
  root.style.width = '1400px';
  root.style.background = '#ffffff';
  root.style.padding = '20px';
  root.style.boxSizing = 'border-box';

  // Header
  const header = clonedDoc.createElement('div');
  header.style.cssText = 'text-align:center;margin-bottom:20px;padding-bottom:15px;border-bottom:3px solid #FFBF00;';
  header.innerHTML = `
    <h1 style="font-size:24px;font-weight:700;color:#2D2D2D;margin-bottom:8px;">Haftalık Çalışma Programı</h1>
    <p style="font-size:14px;color:#666;margin:3px 0;">Öğrenci: ${student.firstName} ${student.lastName}</p>
    <p style="font-size:14px;color:#666;margin:3px 0;">Program: ${formatLocalDate(currentWindowStart)} - ${formatLocalDate(addDays(currentWindowStart, 6))}</p>
    <p style="font-size:14px;color:#666;margin:3px 0;">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
  `;
  root.insertBefore(header, root.firstChild);

  // Her görev kartındaki 3 textarea'yı statik 3 div'e çevir
  root.querySelectorAll('.flex-1.min-w-0').forEach((container) => {
    const areas = Array.from(container.querySelectorAll('textarea')) as HTMLTextAreaElement[];
    if (areas.length === 0) return;

    const name = (areas[0]?.value || areas[0]?.placeholder || '').trim();
    const dur  = (areas[1]?.value || areas[1]?.placeholder || '').trim();
    const crs  = (areas[2]?.value || areas[2]?.placeholder || '').trim();

    // Temizle
    container.innerHTML = '';

    // İsim
    const n = clonedDoc.createElement('div');
    n.textContent = name || 'Görev adı';
    n.style.cssText = 'font-size:14px;font-weight:600;white-space:pre-wrap;word-break:break-word;';
    container.appendChild(n);

    // Süre
    const d = clonedDoc.createElement('div');
    d.textContent = dur || 'Süre';
    d.style.cssText = 'margin-top:4px;font-size:12px;color:#4b5563;white-space:pre-wrap;word-break:break-word;';
    container.appendChild(d);

    // Ders adı
    const c = clonedDoc.createElement('div');
    c.textContent = crs || 'Ders adı';
    c.style.cssText = 'margin-top:2px;font-size:12px;color:#6b7280;white-space:pre-wrap;word-break:break-word;';
    container.appendChild(c);
  });

  // Etkileşimli öğeleri temizle
  root.querySelectorAll('button, svg').forEach(n => n.remove());
  (root.style as any).opacity = '1';
}

      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true }
    } as const;

    // Önce canvas üretip boş mu kontrol et
    const worker: any = html2pdf().set(opt).from(exportRef.current).toCanvas();
    const canvas: HTMLCanvasElement = await worker.get('canvas');
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      alert('PDF kaynağı boş görünüyor. DOM kopyası oluşturulamadı.');
      return;
    }

    await worker.toPdf().save();
  } catch (e) {
    console.error('PDF oluşturma hatası:', e);
    alert('PDF oluşturulurken bir hata oluştu.');
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

  const existingProgram = getCurrentWindowProgram();

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
                onClick={() => saveProgram(days)}
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
            7 Günlük Program
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDay('prev')}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {currentWindowStart.toLocaleDateString('tr-TR')} - {
                addDays(currentWindowStart, 6).toLocaleDateString('tr-TR')
              }
            </span>
            <button
              onClick={() => navigateDay('next')}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
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
                <p className="text-green-800 text-sm">
                  ✅ Bu tarih aralığı için program mevcut - Düzenleyebilirsiniz
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  📝 Bu tarih aralığı için yeni program oluşturuluyor
                </p>
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
                  onClick={async () => {
                    if (isReviewMode) {
                      // Deactivating review mode - update task completion status and save changes
                      const updatedDays = days.map((day, dayIdx) => ({
                        ...day,
                        tasks: day.tasks.map(task => {
                          const taskKey = `${dayIdx}-${task.id}`;
                          const reviewState = taskReviewStates[taskKey] || 'neutral';
                          return {
                            ...task,
                            completed: reviewState === 'completed'
                          };
                        })
                      }));

                      // Update local state
                      setDays(updatedDays);

                      // Save to database with updated data
                      try {
                        await saveProgram(updatedDays);
                      } catch (error) {
                        console.error('Error saving program:', error);
                        alert('Program kaydedilirken bir hata oluştu!');
                      }

                      // Clear review states
                      setTaskReviewStates({});
                    }
                    setIsReviewMode(!isReviewMode);
                  }}
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
                    className={getTaskClasses(getTaskVisualState(dayIndex, task), isReviewMode)}
                    onClick={() => isReviewMode && handleTaskReviewToggle(dayIndex, task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <textarea
                          value={task.name || ''}
                          onChange={(e) => updateTask(dayIndex, task.id, { name: e.target.value })}
                          placeholder="Görev adı"
                          className="w-full text-sm font-medium bg-transparent border-none focus:outline-none resize-none overflow-hidden"
                          rows={1}
                          disabled={isReviewMode}
                          onClick={(e) => e.stopPropagation()}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = el.scrollHeight + 'px';
                            }
                          }}
                        />
                        <textarea
                          value={task.duration || ''}
                          onChange={(e) => updateTask(dayIndex, task.id, { duration: e.target.value })}
                          placeholder="Süre"
                          className="w-full text-xs text-gray-600 bg-transparent border-none focus:outline-none mt-1 resize-none overflow-hidden"
                          rows={1}
                          disabled={isReviewMode}
                          onClick={(e) => e.stopPropagation()}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = el.scrollHeight + 'px';
                            }
                          }}
                        />
                        <textarea
                          value={task.courseName || ''}
                          onChange={(e) => updateTask(dayIndex, task.id, { courseName: e.target.value })}
                          placeholder="Ders adı"
                          className="w-full text-xs text-gray-500 bg-transparent border-none focus:outline-none mt-1 resize-none overflow-hidden"
                          rows={1}
                          disabled={isReviewMode}
                          onClick={(e) => e.stopPropagation()}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = el.scrollHeight + 'px';
                            }
                          }}
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