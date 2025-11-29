import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, MoreVertical, Trash2, Download, Clock, BookOpen, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useApp } from '../../contexts/AppContext';
import { Task, DayProgram } from '../../types';

interface ProgramCreatorProps {
  studentId: string;
  onBack: () => void;
}

// Helper: add days
const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// Helper: YYYY-MM-DD
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: midnight
const normalizeDate = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Helper: in range
const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  const d = normalizeDate(date);
  const s = normalizeDate(startDate);
  const e = normalizeDate(endDate);
  return d >= s && d <= e;
};

// Helper: Monday start
const getCanonicalWeekStart = (date: Date): Date => {
  const n = normalizeDate(date);
  const dow = n.getDay(); // 0 Sun, 1 Mon
  const sub = dow === 0 ? 6 : dow - 1;
  return addDays(n, -sub);
};

export default function ProgramCreator({ studentId, onBack }: ProgramCreatorProps) {
  const { students, programs, addProgram, updateProgram, user } = useApp();
  const student = students?.find(s => s.id === studentId);
  
  // Normal düzenleme ekranı referansı
  const programGridRef = useRef<HTMLDivElement>(null);
  
  // ÇIKTI İÇİN ÖZEL REFERANS
  const printRef = useRef<HTMLDivElement>(null);

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
    const base = 'border rounded-lg p-3 transition-all duration-200';
    let color = '';
    switch (visualState) {
      case 'completed': color = 'bg-green-100 border-green-300'; break;
      case 'failed': color = 'bg-red-100 border-red-300'; break;
      default: color = 'bg-white border-gray-200'; break;
    }
    if (reviewMode) {
      const interactive = 'cursor-pointer hover:shadow-md';
      const hover = visualState === 'completed'
        ? 'hover:bg-green-200'
        : visualState === 'failed'
        ? 'hover:bg-red-200'
        : 'hover:bg-gray-50';
      return `${base} ${color} ${interactive} ${hover}`;
    }
    return `${base} ${color}`;
  };

  const handleTaskReviewToggle = (dayIndex: number, taskId: string) => {
    if (!isReviewMode) return;
    const taskKey = `${dayIndex}-${taskId}`;
    const current = taskReviewStates[taskKey] || 'neutral';
    const next: 'neutral' | 'completed' | 'failed' =
      current === 'neutral' ? 'completed' : current === 'completed' ? 'failed' : 'neutral';
    setTaskReviewStates(prev => ({ ...prev, [taskKey]: next }));
  };

  const initializeEmpty7DayWindow = (windowStart: Date): DayProgram[] => {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(windowStart, i);
      return { date: formatLocalDate(date), dayName: dayNames[date.getDay()], tasks: [] };
    });
  };

  const getCurrentWindowProgram = () => {
    if (!programs || !user?.coachId) return null;
    return programs.find(
      p => p.studentId === studentId && p.coachId === user.coachId && p.weekStart === formatLocalDate(currentWindowStart)
    );
  };

  useEffect(() => {
    const displayedDays = initializeEmpty7DayWindow(currentWindowStart);
    const displayWindowEnd = addDays(currentWindowStart, 6);

    if (programs && user?.coachId) {
      const relevant = programs.filter(p => p.studentId === studentId && p.coachId === user.coachId);
      relevant.forEach(program => {
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
              const idx = displayedDays.findIndex(d => d.date === formatLocalDate(programDayDate));
              if (idx !== -1 && programDay.tasks) displayedDays[idx].tasks = [...programDay.tasks];
            }
          });
        }
      });
    }

    setDays(displayedDays);

    const newStates: Record<string, 'neutral' | 'completed' | 'failed'> = {};
    displayedDays.forEach((day, dayIndex) => {
      day.tasks?.forEach(task => {
        const key = `${dayIndex}-${task.id}`;
        newStates[key] = task.status || (task.completed ? 'completed' : 'neutral');
      });
    });
    setTaskReviewStates(newStates);
  }, [currentWindowStart, programs, studentId, user?.coachId]);

  const addTask = (dayIndex: number) => {
    const newTask: Task = { id: Date.now().toString(), name: '', duration: '', courseName: '', completed: false };
    setDays(prev => prev.map((day, i) => (i === dayIndex ? { ...day, tasks: [...(day.tasks || []), newTask] } : day)));
  };

  const updateTask = (dayIndex: number, taskId: string, updates: Partial<Task>) => {
    setDays(prev =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, tasks: (day.tasks || []).map(t => (t.id === taskId ? { ...t, ...updates } : t)) }
          : day
      )
    );
  };

  const deleteTask = (dayIndex: number, taskId: string) => {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      setDays(prev =>
        prev.map((day, i) => (i === dayIndex ? { ...day, tasks: (day.tasks || []).filter(t => t.id !== taskId) } : day))
      );
      setSelectedTask(null);
    }
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
        const idx = weekDays.findIndex(wd => wd.date === day.date);
        if (idx !== -1) {
          const updatedTasks =
            day.tasks?.map(task => {
              const taskKey = `${originalDayIndex}-${task.id}`;
              const reviewState = taskReviewStates[taskKey];
              return {
                ...task,
                status: reviewState || task.status || 'neutral',
                completed: reviewState === 'completed' || (!reviewState && task.completed),
              };
            }) || [];
          weekDays[idx] = { ...day, tasks: updatedTasks };
        }
      });

      const savePromises: Promise<void>[] = [];
      for (const [weekStartKey, weekDays] of programWeeksMap.entries()) {
        const existingProgram = programs?.find(
          p => p.studentId === studentId && p.coachId === user.coachId && p.weekStart === weekStartKey
        );
        if (existingProgram) {
          savePromises.push(updateProgram(existingProgram.id, { days: weekDays }));
        } else {
          const newProgram = {
            studentId,
            coachId: user.coachId,
            weekStart: weekStartKey,
            days: weekDays,
            createdAt: new Date().toISOString(),
          };
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

  // PNG Export Fonksiyonu
  const exportToPNG = async () => {
    if (!printRef.current || !student) return;

    const originalBtnText = document.activeElement?.textContent;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.innerText = "Hazırlanıyor...";
    }

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1600,
        windowWidth: 1600,
        height: printRef.current.offsetHeight, 
        windowHeight: printRef.current.offsetHeight,
      });

      const link = document.createElement('a');
      link.download = `${student.firstName}_${student.lastName}_Program_${formatLocalDate(currentWindowStart)}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('PNG oluşturma hatası:', error);
      alert('Program indirilirken bir hata oluştu!');
    } finally {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.innerText = "Programı İndir (PNG)";
      }
    }
  };

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
              <h1 className="text-xl font-bold text-gray-900">
                Program Oluştur - {student.firstName} {student.lastName}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToPNG}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Programı İndir (PNG)</span>
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

        {/* Program Status */}
        <div className="mb-4">
          {(() => {
            const totalTasks = (days || []).reduce((t, d) => t + (d.tasks?.length || 0), 0);
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

        {/* Grid (Ekranda Düzenlenebilir Alan) */}
        <div ref={programGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {(days || []).map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-lg shadow-md p-4">
              {/* Day Header */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">{day.dayName}</h3>
                <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('tr-TR')}</p>
              </div>

              {/* Actions */}
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
                      const updatedDays = days.map((d, dIdx) => ({
                        ...d,
                        tasks: d.tasks.map(task => {
                          const key = `${dIdx}-${task.id}`;
                          const state = taskReviewStates[key] || 'neutral';
                          return { ...task, status: state, completed: state === 'completed' };
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

                {(!day.tasks || day.tasks.length === 0) && (
                  <div className="text-center text-gray-400 text-sm py-4">Henüz görev eklenmemiş</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YENİ GİZLİ PNG ÇIKTI ŞABLONU (GÜNCELLENMİŞ PREMIUM SARI-TURUNCU TASARIM) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1000 }}>
        <div ref={printRef} className="bg-white p-10 box-border relative" style={{ width: '1600px', minHeight: '1000px', fontFamily: 'Inter, sans-serif' }}>
            
            {/* Logo Filigranı */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                <img src="/arı koçluk logo.jpg" alt="Arı Koçluk" className="w-1/2 h-auto object-contain" />
            </div>

            {/* Çıktı Başlık Alanı */}
            <div className="flex justify-between items-center mb-10 border-b-2 border-orange-100 pb-6 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                        {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">
                            {student.firstName} {student.lastName}
                        </h1>
                        <h2 className="text-2xl text-orange-600 font-medium">Haftalık Çalışma Programı</h2>
                    </div>
                </div>
                <div className="text-right">
                     <div className="bg-orange-50 px-8 py-4 rounded-lg border border-orange-100 shadow-sm">
                        <p className="text-xs text-orange-500 uppercase tracking-wider font-bold mb-1">TARİH ARALIĞI</p>
                        <p className="text-xl font-bold text-gray-800">
                            {currentWindowStart.toLocaleDateString('tr-TR')} - {addDays(currentWindowStart, 6).toLocaleDateString('tr-TR')}
                        </p>
                     </div>
                </div>
            </div>

            {/* Günler */}
            <div className="flex w-full gap-4 items-stretch relative z-10">
                {(days || []).map((day, index) => (
                    <div 
                        key={`print-${index}`} 
                        className="flex-1 flex flex-col bg-white border border-orange-100 rounded-lg overflow-hidden shadow-sm"
                        style={{ minWidth: 0 }}
                    >
                        {/* Gün Başlığı */}
                        <div className={`py-3 px-2 text-center border-b ${
                            index === 6 ? 'bg-orange-100 border-orange-200' : 'bg-orange-50 border-orange-100'
                        }`}>
                            <h3 className={`font-bold text-lg ${
                                 index === 6 ? 'text-orange-700' : 'text-gray-800'
                            }`}>
                                {day.dayName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(day.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        {/* Görevler Listesi */}
                        <div className="p-3 flex-1 bg-white space-y-2">
                            {(day.tasks || []).map((task, i) => {
                                const visualState = getTaskVisualState(index, task);
                                
                                let cardClasses = 'bg-white border-orange-100'; // Default Neutral
                                
                                if (visualState === 'completed') {
                                    cardClasses = 'bg-amber-50 border-amber-200';
                                } else if (visualState === 'failed') {
                                    cardClasses = 'bg-orange-50 border-orange-200';
                                }

                                return (
                                <div 
                                    key={i} 
                                    className={`p-3 rounded border shadow-sm relative overflow-hidden flex flex-col gap-2 ${cardClasses}`}
                                >
                                    <div className="font-semibold text-gray-900 text-sm leading-snug break-words whitespace-pre-wrap">
                                        {task.name || 'İsimsiz Görev'}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {task.courseName && (
                                            <div className="flex items-center justify-center px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold rounded border border-orange-200 h-6">
                                                <span className="leading-none">{task.courseName}</span>
                                            </div>
                                        )}
                                        {task.duration && (
                                            <div className="flex items-center justify-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200 h-6">
                                                <Clock className="w-3 h-3" />
                                                <span className="leading-none pt-[1px]">{task.duration}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )})}

                            {(!day.tasks || day.tasks.length === 0) && (
                                <div className="h-full flex flex-col items-center justify-center py-8 opacity-30">
                                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">BOŞ</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Alt Bilgi */}
            <div className="mt-8 pt-6 border-t border-orange-100 flex justify-between items-center text-gray-400 text-sm relative z-10">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-orange-500">Arı Koçluk Sistemleri</span>
                </div>
                <div className="font-medium opacity-60"> 
                    {new Date().toLocaleDateString('tr-TR')}
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}