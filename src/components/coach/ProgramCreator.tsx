import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, MoreVertical, Trash2, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
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
  const exportRef = useRef<HTMLDivElement>(null);

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

const exportToPDF = async () => {
    if (!student || !exportRef.current) return;

    // Kullanıcıya bilgi ver
    const originalBtnText = document.activeElement?.textContent;
    if (document.activeElement instanceof HTMLElement) {
       document.activeElement.innerText = "Hazırlanıyor...";
    }

    const opt = {
      margin: [10, 10, 10, 10], 
      filename: `${student.firstName}_${student.lastName}_Program_${formatLocalDate(currentWindowStart)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // Sayfa kırılımlarını yönet
      pagebreak: { mode: ['css', 'legacy'], avoid: '.keep-together' }, 
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollY: 0,
        windowWidth: 1400,
        onclone: (clonedDoc: Document) => {
          const root = clonedDoc.querySelector('[data-export-root]') as HTMLElement | null;
          if (!root) return;

          // 1. TEMİZLİK: Animasyon, Transform ve Gölgeleri kaldır
          const badElements = clonedDoc.querySelectorAll('.aos-element, [data-aos], .transition-all, .transform');
          badElements.forEach(el => {
            const element = el as HTMLElement;
            element.classList.remove('aos-element', 'aos-animate', 'transition-all', 'transform');
            element.removeAttribute('data-aos'); 
            element.style.opacity = '1';       
            element.style.transform = 'none';  
            element.style.transition = 'none'; 
            element.style.boxShadow = 'none';
          });

          // 2. DÜZEN: Grid yerine Flex kullan (Sayfa yapısı için)
          root.style.display = 'flex';
          root.style.flexWrap = 'wrap';
          root.style.gap = '20px';
          root.style.justifyContent = 'flex-start';
          // Grid sınıflarını temizle
          root.className = root.className.replace(/grid-cols-\S+/g, '');

          // Gün Kartlarını Düzenle
          const dayCards = root.querySelectorAll('.bg-white.rounded-lg.shadow-md');
          dayCards.forEach((cardNode) => {
            const card = cardNode as HTMLElement;
            card.classList.add('keep-together'); 
            card.style.flex = '0 0 31%'; // Yan yana 3 kart
            card.style.maxWidth = '31%';
            card.style.marginBottom = '20px';
            card.style.height = 'auto';      // Yükseklik serbest
            card.style.overflow = 'visible'; // Taşma serbest
            card.style.border = '1px solid #ccc';
            card.style.boxShadow = 'none';
            
            // Kart içindeki flex yapılarını da serbest bırak
            const cardInner = card.querySelectorAll('div');
            cardInner.forEach(div => {
                div.style.overflow = 'visible';
                div.style.height = 'auto';
            });
          });

          // 3. TEXTAREA -> DIV DÖNÜŞÜMÜ (Kesin Çözüm)
          root.querySelectorAll('textarea').forEach(node => {
            const ta = node as HTMLTextAreaElement;
            const div = clonedDoc.createElement('div');
            
            // Font stillerini kopyala
            const style = window.getComputedStyle(ta);
            div.style.fontFamily = style.fontFamily;
            div.style.fontSize = style.fontSize;
            div.style.fontWeight = ta.className.includes('font-medium') ? 'bold' : style.fontWeight;
            div.style.color = '#000000'; // Rengi siyaha sabitle (gri bazen silik çıkar)
            
            // Metni aktar
            div.textContent = ta.value || ta.placeholder || '';
            
            // --- KRİTİK AYARLAR ---
            div.style.display = 'block';
            div.style.width = '100%';
            div.style.height = 'auto';         // İçeriğe göre uza
            div.style.minHeight = '20px';      // En az bir satır boyu
            div.style.whiteSpace = 'pre-wrap'; // Satır atlamaları koru
            div.style.wordBreak = 'break-word';// Uzun kelimeleri böl
            div.style.overflow = 'visible';    // Gizleme yapma
            div.style.padding = '0px';
            div.style.paddingBottom = '5px';   // Alt kısımdan kesilmemesi için boşluk
            div.style.marginBottom = '4px';    // Elemanlar arası boşluk
            div.style.lineHeight = '1.4';      // Satırları biraz aç
            div.style.border = 'none';
            div.style.background = 'transparent';
            
            // Eğer font küçükse (ders adı, süre vb.) biraz daha belirgin yap
            if (parseFloat(style.fontSize) < 12) {
                 div.style.fontSize = '11px';
                 div.style.color = '#333';
            }

            ta.replaceWith(div);
          });

          // UI Temizliği
          root.querySelectorAll('button, svg').forEach(n => n.remove());
        },
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true },
    } as const;

    await new Promise(r => setTimeout(r, 100));
    
    try {
        await html2pdf().set(opt).from(exportRef.current).save();
    } finally {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.innerText = "PDF İndir";
         }
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

        {/* Grid */}
        <div ref={exportRef} data-export-root className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
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
                          return { ...task, completed: state === 'completed' };
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
    </div>
  );
}