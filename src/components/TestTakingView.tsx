import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TestPaper, Question } from '../types/database';
import { submissionsService } from '../services/api';
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  LayoutGrid
} from 'lucide-react';

interface TestTakingViewProps {
  test: TestPaper;
  questions: Question[];
  onComplete: (result: { submissionId: string; score: number; totalPoints: number; percentage: number }) => void;
  onExit: () => void;
}

export const TestTakingView: React.FC<TestTakingViewProps> = ({
  test,
  questions,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const totalDurationSecs = (test.duration_minutes || 30) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalDurationSecs);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMobileGrid, setShowMobileGrid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const answersRef = useRef(answers);
  const secondsLeftRef = useRef(secondsLeft);
  const submittingRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const timeSpent = Math.max(0, totalDurationSecs - secondsLeftRef.current);
      const res = await submissionsService.submitTest(test.id, answersRef.current, timeSpent);
      onComplete(res);
    } catch (e: any) {
      alert('Failed to submit test: ' + (e?.message || 'Unknown error'));
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [totalDurationSecs, test.id, onComplete]);

  // Keep active question in view on mobile quick-jump strip
  useEffect(() => {
    const el = document.getElementById(`mobile-nav-btn-${currentIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Reliable timestamp countdown timer (immune to tab backgrounding / re-render drift)
  useEffect(() => {
    const targetEndTime = Date.now() + totalDurationSecs * 1000;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [totalDurationSecs, handleSubmit]);

  // Keyboard navigation (ArrowLeft & ArrowRight when not focused in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length]);

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim() !== '').length;
  const unansweredCount = questions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  if (!currentQ) {
    return (
      <div className="p-8 text-center text-slate-500">
        No questions available for this test.
        <button onClick={onExit} className="mt-4 block mx-auto text-indigo-600 font-medium">Go Back</button>
      </div>
    );
  }

  const isLowTime = secondsLeft < 120; // less than 2 mins

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 flex flex-col">
      {/* Top Test Header Bar */}
      <div className="sticky top-0 z-20 pt-[env(safe-area-inset-top,0px)] bg-white/92 dark:bg-slate-900/92 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 select-none">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
                onExit();
              }
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quit Test</span>
            <span className="sm:hidden">Quit</span>
          </button>

          {/* Title & Progress Count */}
          <div className="text-center min-w-0 px-1">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-xs">
              {test.title}
            </h2>
            <p className="text-[10px] text-slate-400 truncate">
              Q {currentIndex + 1} of {questions.length} • {answeredCount} Answered
            </p>
          </div>

          {/* Timer pill */}
          <div className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-semibold shrink-0 transition-colors ${isLowTime
              ? 'bg-rose-100 text-rose-700 animate-pulse dark:bg-rose-950 dark:text-rose-300'
              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
            }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsLeft)}</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Mobile Horizontal Quick-Jump Strip (< lg screens) */}
        <div className="lg:hidden bg-slate-50/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowMobileGrid(true)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 rounded-xl px-2.5 py-1.5 uppercase tracking-wider shrink-0 flex items-center gap-1 active:scale-95 transition-all touch-manipulation"
            title="Open question grid drawer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid ({answeredCount}/{questions.length})</span>
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />
          {questions.map((q, idx) => {
            const isAnswered = Boolean(answers[q.id]?.trim());
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                id={`mobile-nav-btn-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center transition-all touch-manipulation active:scale-90 ${isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 shadow-sm'
                    : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Side-by-Side Questionnaire & Question Grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left / Primary Column: Questionnaire */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm page-enter">
              {/* Question Header & Points */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                    Question {currentIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400">of {questions.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  {answers[currentQ.id]?.trim() ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Answered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      Not answered
                    </span>
                  )}
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {currentQ.points} {currentQ.points === 1 ? 'Point' : 'Points'}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed mb-6">
                {currentQ.question_text}
              </h3>

              {/* Multiple Choice Answers */}
              {currentQ.question_type === 'multiple_choice' && currentQ.options && (
                <div className="space-y-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 active:scale-[0.99] ${isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-xl font-semibold text-xs flex items-center justify-center shrink-0 transition-colors ${isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                          {letter}
                        </div>
                        <span className={`text-sm leading-snug flex-1 ${isSelected ? 'font-semibold text-indigo-950 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                          {opt}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True / False Answers */}
              {currentQ.question_type === 'true_false' && (
                <div className="grid grid-cols-2 gap-3">
                  {['True', 'False'].map((val) => {
                    const isSelected = answers[currentQ.id] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectOption(val)}
                        className={`py-5 px-4 rounded-2xl border text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        <span className="text-base">{val}</span>
                        {isSelected && <span className="text-[10px] text-indigo-500 font-normal">Selected</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Input */}
              {currentQ.question_type === 'short_answer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Type your answer below:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter answer..."
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleSelectOption(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    Tip: Answers are case-insensitive.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Question Grid Sidebar (Visible on desktop screens) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Question Grid
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {answeredCount} of {questions.length} Answered
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {progressPercent}%
                </span>
              </div>

              {/* Mini Progress Bar in Sidebar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-indigo-600 ring-1 ring-indigo-400" />
                  Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700" />
                  Answered ({answeredCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                  Remaining ({unansweredCount})
                </span>
              </div>

              {/* Always Visible Question Grid Buttons */}
              <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-6 gap-2 max-h-[46vh] lg:max-h-[calc(100vh-340px)] overflow-y-auto p-1 scrollbar-thin">
                {questions.map((q, idx) => {
                  const isAnswered = Boolean(answers[q.id]?.trim());
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all active:scale-90 ${isCurrent
                          ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900 bg-indigo-600 text-white shadow-md'
                          : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Quick Submit Action */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Questionnaire</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Sticky Bottom Actions Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 select-none">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors touch-manipulation active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMobileGrid(true)}
            className="lg:hidden px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 touch-manipulation active:scale-95"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentIndex + 1} / {questions.length}</span>
          </button>

          <div className="hidden lg:block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Question <span className="text-slate-900 dark:text-white font-bold">{currentIndex + 1}</span> of {questions.length}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shadow-indigo-600/20 transition-all touch-manipulation"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all touch-manipulation"
            >
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </footer>

      {/* Mobile Question Grid Bottom Sheet */}
      {showMobileGrid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setShowMobileGrid(false)}
            aria-label="Close question grid"
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 max-h-[85vh] flex flex-col shadow-2xl z-10">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Question Navigator</h3>
                <span className="text-xs font-semibold text-slate-400">({answeredCount}/{questions.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileGrid(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 py-3 px-1 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-md bg-indigo-600 ring-1 ring-indigo-400" />
                Current
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-md bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700" />
                Answered ({answeredCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                Remaining ({unansweredCount})
              </span>
            </div>

            {/* Grid of buttons */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 py-4 overflow-y-auto max-h-[50vh]">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]?.trim());
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMobileGrid(false);
                    }}
                    className={`h-11 rounded-2xl text-xs font-bold flex items-center justify-center transition-all touch-manipulation active:scale-95 ${isCurrent
                        ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-md'
                        : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowMobileGrid(false);
                  setShowConfirm(true);
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Submit Questionnaire ({answeredCount}/{questions.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center page-enter relative">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Questionnaire?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              You have answered <span className="font-semibold text-slate-900 dark:text-white">{answeredCount}</span> out of <span className="font-semibold text-slate-900 dark:text-white">{questions.length}</span> questions.
              {unansweredCount > 0 && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                  {unansweredCount} questions are still unanswered!
                </span>
              )}
              <span className="block mt-2 text-[11px] text-slate-400">
                All test attempts are preserved in the DB. You can retake this test later and compare past reports.
              </span>
            </p>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Review Answers
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Grading...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
