import React, { useState, useEffect } from 'react';
import { TestPaper, QuestionType } from '../types/database';
import { testsService } from '../services/api';
import {
  ChevronLeft,
  Clock,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  FileCode,
  ListChecks,
  Save,
  Copy,
  Search,
  BookOpen,
  X
} from 'lucide-react';

export interface EditableQuestion {
  id?: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

interface EditTestViewProps {
  testId: string;
  onBack: () => void;
  onSaved: (updatedTest: TestPaper) => void;
}

const TIMER_PRESETS = [15, 30, 45, 60, 95, 120];

export const EditTestView: React.FC<EditTestViewProps> = ({
  testId,
  onBack,
  onSaved,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');

  // Test metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [category, setCategory] = useState('General');
  const [isPublished, setIsPublished] = useState(true);

  // Questions
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Load test details and questions when view loads
  useEffect(() => {
    let isMounted = true;
    const fetchTestData = async () => {
      setLoading(true);
      setStatusMessage(null);
      try {
        const data = await testsService.getTestById(testId);
        if (!isMounted) return;

        if (data) {
          setTitle(data.test.title || '');
          setDescription(data.test.description || '');
          setDurationMinutes(data.test.duration_minutes || 30);
          setCategory(data.test.category || 'General');
          setIsPublished(data.test.is_published ?? true);

          const formattedQuestions: EditableQuestion[] = (data.questions || []).map((q) => ({
            id: q.id,
            question_text: q.question_text || '',
            question_type: q.question_type || 'multiple_choice',
            options: Array.isArray(q.options) && q.options.length > 0
              ? [...q.options]
              : q.question_type === 'true_false'
                ? ['True', 'False']
                : ['Option A', 'Option B', 'Option C', 'Option D'],
            correct_answer: q.correct_answer || '',
            explanation: q.explanation || '',
            points: Number(q.points) || 1,
          }));

          if (formattedQuestions.length === 0) {
            formattedQuestions.push({
              question_text: '',
              question_type: 'multiple_choice',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct_answer: 'Option A',
              explanation: '',
              points: 1,
            });
          }

          setQuestions(formattedQuestions);
        } else {
          setStatusMessage({ type: 'error', text: 'Could not load test paper details.' });
        }
      } catch (err: any) {
        if (isMounted) {
          setStatusMessage({ type: 'error', text: 'Error loading test: ' + (err.message || 'Unknown error') });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTestData();

    return () => {
      isMounted = false;
    };
  }, [testId]);

  // Question operations
  const handleAddQuestion = () => {
    const newQ: EditableQuestion = {
      question_text: '',
      question_type: 'multiple_choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 'Option A',
      explanation: '',
      points: 1,
    };
    setQuestions((prev) => [...prev, newQ]);
    setStatusMessage(null);
  };

  const handleDuplicateQuestion = (idx: number) => {
    const target = questions[idx];
    const duplicate: EditableQuestion = {
      question_text: `${target.question_text} (Copy)`,
      question_type: target.question_type,
      options: [...target.options],
      correct_answer: target.correct_answer,
      explanation: target.explanation,
      points: target.points,
    };
    setQuestions((prev) => {
      const copy = [...prev];
      copy.splice(idx + 1, 0, duplicate);
      return copy;
    });
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('The test must have at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    setQuestions((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleUpdateQuestion = (idx: number, updates: Partial<EditableQuestion>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...updates };
      return copy;
    });
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      const newOpts = [...q.options];
      const oldVal = newOpts[optIdx];
      newOpts[optIdx] = val;
      q.options = newOpts;
      if (q.correct_answer === oldVal) {
        q.correct_answer = val;
      }
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleAddOption = (qIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      const nextLetter = String.fromCharCode(65 + q.options.length);
      q.options = [...q.options, `Option ${nextLetter}`];
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      if (q.options.length <= 2) {
        alert('Multiple choice questions require at least 2 options.');
        return prev;
      }
      const removedVal = q.options[optIdx];
      const newOpts = q.options.filter((_, i) => i !== optIdx);
      q.options = newOpts;
      if (q.correct_answer === removedVal) {
        q.correct_answer = newOpts[0] || '';
      }
      copy[qIdx] = q;
      return copy;
    });
  };

  // Switch to bulk JSON mode
  const handleSwitchToJson = () => {
    const exportable = questions.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      points: q.points,
    }));
    setJsonInput(JSON.stringify(exportable, null, 2));
    setActiveTab('json');
  };

  // Switch from JSON to form mode
  const handleSwitchToForm = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON must be a non-empty array of questions.');
      }
      const validated: EditableQuestion[] = parsed.map((item, idx) => ({
        id: questions[idx]?.id,
        question_text: String(item.question_text || ''),
        question_type: item.question_type || 'multiple_choice',
        options: Array.isArray(item.options) ? item.options : ['Option A', 'Option B'],
        correct_answer: String(item.correct_answer || ''),
        explanation: String(item.explanation || ''),
        points: Number(item.points) || 1,
      }));
      setQuestions(validated);
      setActiveTab('form');
      setStatusMessage(null);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Invalid JSON: ' + err.message });
    }
  };

  // Duration adjustments
  const handleAdjustDuration = (delta: number) => {
    setDurationMinutes((prev) => Math.max(1, Math.min(360, (prev || 30) + delta)));
  };

  const formatDurationReadable = (mins: number) => {
    if (mins < 60) return `${mins} minutes`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs} hr${hrs > 1 ? 's' : ''}${rem > 0 ? ` ${rem} min${rem > 1 ? 's' : ''}` : ''}`;
  };

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  const filteredQuestionIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      if (!searchQuery.trim()) return true;
      const lower = searchQuery.toLowerCase();
      return (
        `question ${idx + 1}`.includes(lower) ||
        q.question_text.toLowerCase().includes(lower) ||
        q.options.some((opt) => opt.toLowerCase().includes(lower)) ||
        q.correct_answer.toLowerCase().includes(lower)
      );
    });

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMessage(null);

    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide a test title.' });
      return;
    }

    if (!durationMinutes || durationMinutes < 1) {
      setStatusMessage({ type: 'error', text: 'Test duration timer must be at least 1 minute.' });
      return;
    }

    let finalQuestions = questions;

    if (activeTab === 'json') {
      try {
        const parsed = JSON.parse(jsonInput);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('JSON must contain an array with at least one question.');
        }
        finalQuestions = parsed.map((item, idx) => ({
          id: questions[idx]?.id,
          question_text: String(item.question_text || ''),
          question_type: item.question_type || 'multiple_choice',
          options: Array.isArray(item.options) ? item.options : ['Option A', 'Option B'],
          correct_answer: String(item.correct_answer || ''),
          explanation: String(item.explanation || ''),
          points: Number(item.points) || 1,
        }));
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Invalid JSON: ' + err.message });
        return;
      }
    }

    // Validate questions
    for (let i = 0; i < finalQuestions.length; i++) {
      const q = finalQuestions[i];
      if (!q.question_text.trim()) {
        setStatusMessage({ type: 'error', text: `Question #${i + 1} is missing its question prompt.` });
        return;
      }
      if (q.question_type === 'multiple_choice') {
        if (!q.options || q.options.length < 2) {
          setStatusMessage({ type: 'error', text: `Question #${i + 1} must have at least 2 options.` });
          return;
        }
        if (!q.correct_answer.trim() || !q.options.includes(q.correct_answer)) {
          setStatusMessage({
            type: 'error',
            text: `Question #${i + 1} does not have a valid correct answer selected from its options.`,
          });
          return;
        }
      } else if (!q.correct_answer.trim()) {
        setStatusMessage({ type: 'error', text: `Question #${i + 1} is missing the correct answer key.` });
        return;
      }
    }

    setSaving(true);
    try {
      const updated = await testsService.updateTest(
        testId,
        {
          title: title.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes),
          category: category.trim() || 'General',
          is_published: isPublished,
        },
        finalQuestions
      );

      setStatusMessage({ type: 'success', text: 'Test paper updated successfully!' });
      setTimeout(() => {
        onSaved(updated);
      }, 700);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to update test: ' + (err.message || 'Unknown error') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 pb-36 animate-fadeIn">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95 shrink-0 touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Tests</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                Edit Test Paper
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 dark:bg-slate-800 dark:text-slate-200 shrink-0">
                {category || 'General'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 -mt-0.5 truncate hidden xs:block">
              Adjust duration timer, edit, add, or delete test questions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'json') handleSwitchToForm();
                else setActiveTab('form');
              }}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all touch-manipulation ${activeTab === 'form'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white dark:text-slate-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'form') handleSwitchToJson();
                else setActiveTab('json');
              }}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all touch-manipulation ${activeTab === 'json'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white dark:text-slate-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              JSON
            </button>
          </div>

          <button
            type="button"
            disabled={saving || loading}
            onClick={() => handleSave()}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 active:scale-95 text-xs font-bold shadow-md shadow-black/10 dark:shadow-none flex items-center gap-1.5 transition-all disabled:opacity-50 touch-manipulation"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-medium text-slate-400">Loading test paper and questions...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-2.5 animate-fadeIn ${statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Test Metadata & Timer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-900 dark:text-white" />
                Assessment Settings & Duration Timer
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Published:
                </span>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${isPublished ? 'bg-slate-900 dark:bg-white justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  title={isPublished ? 'Click to unpublish' : 'Click to publish'}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Test Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LNAT Paper 1: Medical Ethics & Patient Autonomy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. LNAT - Critical Reasoning"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500"
                />
              </div>

              {/* TIMER ADJUSTMENT PANEL */}
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-950 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-900 dark:text-white" />
                    Test Timer Duration
                  </label>
                  <span className="text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:border-slate-700 shadow-2xs">
                    {formatDurationReadable(durationMinutes)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjustDuration(-10)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 active:scale-95 border border-slate-200/80 dark:border-slate-700 transition-all shadow-2xs"
                    title="Subtract 10 minutes"
                  >
                    -10m
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustDuration(-5)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 active:scale-95 border border-slate-200/80 dark:border-slate-700 transition-all shadow-2xs"
                    title="Subtract 5 minutes"
                  >
                    -5m
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max="360"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full text-center font-bold text-sm px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500 shadow-2xs"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-medium pointer-events-none">
                      mins
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdjustDuration(5)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 active:scale-95 border border-slate-200/80 dark:border-slate-700 transition-all shadow-2xs"
                    title="Add 5 minutes"
                  >
                    +5m
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustDuration(10)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 active:scale-95 border border-slate-200/80 dark:border-slate-700 transition-all shadow-2xs"
                    title="Add 10 minutes"
                  >
                    +10m
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <span className="text-[10px] text-slate-400 font-medium mr-1 shrink-0">Presets:</span>
                  {TIMER_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDurationMinutes(preset)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 ${durationMinutes === preset
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description / Student Guidelines
                </label>
                <textarea
                  rows={2}
                  placeholder="Guidelines, topics tested, or student instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Questions Area */}
          {activeTab === 'form' ? (
            <div className="space-y-4">
              {/* Question list controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-slate-900 dark:text-white" />
                    Questions ({questions.length})
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-700/50 dark:border-slate-700">
                    {totalPoints} Total Points
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {questions.length > 3 && (
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 w-36 sm:w-48 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>

              {/* Question cards list */}
              {filteredQuestionIndices.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400 font-medium">No questions matched your search query.</p>
                </div>
              ) : (
                filteredQuestionIndices.map(({ q, idx }) => (
                  <div
                    key={idx}
                    id={`question-card-${idx}`}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-slate-900 dark:border-white transition-colors space-y-4"
                  >
                    {/* Top bar of question card */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Question #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Points */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
                          <label className="text-[11px] font-semibold text-slate-400">Pts:</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={q.points}
                            onChange={(e) =>
                              handleUpdateQuestion(idx, { points: Math.max(1, Number(e.target.value) || 1) })
                            }
                            className="w-10 px-1 py-0.5 rounded text-xs text-center font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>

                        {/* Move Up / Down */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveQuestion(idx, 'up')}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            title="Move question up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700" />
                          <button
                            type="button"
                            disabled={idx === questions.length - 1}
                            onClick={() => handleMoveQuestion(idx, 'down')}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            title="Move question down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestion(idx)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
                          title="Duplicate question"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Question */}
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Delete question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Type Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {(['multiple_choice', 'true_false', 'short_answer'] as QuestionType[]).map((type) => {
                        const label =
                          type === 'multiple_choice'
                            ? 'Multiple Choice'
                            : type === 'true_false'
                              ? 'True / False'
                              : 'Short Answer';
                        const isSelected = q.question_type === type;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              const options =
                                type === 'multiple_choice'
                                  ? q.options.length >= 2
                                    ? q.options
                                    : ['Option A', 'Option B', 'Option C', 'Option D']
                                  : type === 'true_false'
                                    ? ['True', 'False']
                                    : [];
                              const correct_answer =
                                type === 'true_false'
                                  ? q.correct_answer === 'False'
                                    ? 'False'
                                    : 'True'
                                  : options[0] || '';
                              handleUpdateQuestion(idx, {
                                question_type: type,
                                options,
                                correct_answer,
                              });
                            }}
                            className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${isSelected
                              ? 'border-slate-900 dark:border-white bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Question Prompt */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Question Prompt *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Type question or passage problem here..."
                        value={q.question_text}
                        onChange={(e) => handleUpdateQuestion(idx, { question_text: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500 font-sans"
                      />
                    </div>

                    {/* Options & Answer Key */}
                    {q.question_type === 'multiple_choice' && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Options & Correct Answer Key *
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Tap circle to mark correct answer
                          </span>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correct_answer === opt;

                            return (
                              <div key={optIdx} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuestion(idx, { correct_answer: opt })}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isCorrect
                                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                                    }`}
                                  title={isCorrect ? 'Correct Answer' : 'Click to set as correct answer'}
                                >
                                  {isCorrect && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>

                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(idx, optIdx, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none ${isCorrect
                                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-200 font-semibold'
                                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                                    }`}
                                />

                                {q.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(idx, optIdx)}
                                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                                    title="Remove option"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddOption(idx)}
                          className="text-[11px] font-semibold text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white flex items-center gap-1 pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Another Option
                        </button>
                      </div>
                    )}

                    {q.question_type === 'true_false' && (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Correct Answer Key *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['True', 'False'].map((val) => {
                            const isCorrect = q.correct_answer === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleUpdateQuestion(idx, { correct_answer: val })}
                                className={`py-3 rounded-xl border text-xs font-semibold transition-all ${isCorrect
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-sm'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                  }`}
                              >
                                {val} {isCorrect && '✓ (Correct Key)'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {q.question_type === 'short_answer' && (
                      <div className="space-y-1 pt-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Expected Correct Answer Key *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mitochondria or Photosynthesis"
                          value={q.correct_answer}
                          onChange={(e) => handleUpdateQuestion(idx, { correct_answer: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Explanation / Rationale (Shown to students after submission)
                      </label>
                      <input
                        type="text"
                        placeholder="Explanation of why this answer is correct..."
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestion(idx, { explanation: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500"
                      />
                    </div>
                  </div>
                ))
              )}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-800 dark:border-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99] bg-white dark:bg-slate-900 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Question</span>
              </button>
            </div>
          ) : (
            /* Bulk JSON mode */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-slate-900 dark:text-white" />
                  Bulk JSON Questions Format
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste or modify JSON array of questions, options, and point values.
                </p>
              </div>

              <textarea
                rows={18}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:ring-slate-500 shadow-inner"
              />
            </div>
          )}

          {/* Bottom Floating Bar */}
          <div className="sticky bottom-20 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{questions.length} Questions</span>
              <span>•</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPoints} Pts</span>
              <span>•</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{durationMinutes}m Timer</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={saving}
                onClick={onBack}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving || loading}
                onClick={() => handleSave()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 active:scale-95 text-xs font-bold shadow-md shadow-black/10 dark:shadow-none flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
