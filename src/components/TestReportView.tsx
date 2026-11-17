import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { DetailedSubmission } from '../types/database';
import { submissionsService } from '../services/api';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronLeft,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Printer,
  Calendar,
  User,
  AlertCircle,
  Search,
  ArrowUp,
  History,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface TestReportViewProps {
  submissionId: string;
  onBack: () => void;
  onRetake?: (testId: string) => void;
  onNavigateToTests?: () => void;
}

type QuestionFilter = 'all' | 'correct' | 'incorrect' | 'unanswered';

export const TestReportView: React.FC<TestReportViewProps> = ({
  submissionId,
  onBack,
  onRetake,
  onNavigateToTests,
}) => {
  const [prevSubmissionId, setPrevSubmissionId] = useState(submissionId);
  const [currentSubmissionId, setCurrentSubmissionId] = useState(submissionId);
  const [submission, setSubmission] = useState<DetailedSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QuestionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (prevSubmissionId !== submissionId) {
    setPrevSubmissionId(submissionId);
    setCurrentSubmissionId(submissionId);
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const detail = await submissionsService.getSubmissionDetail(currentSubmissionId);
        if (!detail) {
          setError('Submission details could not be found.');
          return;
        }
        setSubmission(detail);

        if (detail.percentage >= 60) {
          // Trigger celebration confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 },
              colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
            });
          } catch {
            // ignore if blocked
          }
        }
      } catch (err: any) {
        console.error('Failed to load submission report:', err);
        setError(err?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentSubmissionId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Generating Comprehensive Report...
        </h3>
        <p className="text-xs text-slate-400 mt-1">Analyzing scores, answers, and solutions</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Unable to Load Report
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          {error || 'The requested test report could not be found.'}
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Return to Marks
        </button>
      </div>
    );
  }

  const isPassed = submission.percentage >= 50;
  const isExcellent = submission.percentage >= 80;

  const totalQuestions = submission.answers.length;
  const correctCount = submission.answers.filter((a) => a.is_correct).length;
  const unansweredCount = submission.answers.filter((a) => !a.user_answer || a.user_answer.trim() === '').length;
  const incorrectCount = totalQuestions - correctCount;

  // Attempt navigation variables
  const attemptsList = submission.other_attempts || [];
  const currentAttemptNumber = submission.attempt_number || 1;
  const totalAttempts = Math.max(attemptsList.length, currentAttemptNumber);
  const prevAttempt = attemptsList.find(a => a.attempt_number === currentAttemptNumber - 1);
  const scoreDiff = prevAttempt !== undefined ? submission.percentage - prevAttempt.percentage : null;

  // Filtered answers
  const filteredAnswers = submission.answers.map((ans, originalIndex) => ({ ans, originalIndex })).filter(({ ans }) => {
    // Filter by category
    const isUnanswered = !ans.user_answer || ans.user_answer.trim() === '';
    if (filter === 'correct' && !ans.is_correct) return false;
    if (filter === 'incorrect' && ans.is_correct) return false;
    if (filter === 'unanswered' && !isUnanswered) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const qText = ans.question?.question_text?.toLowerCase() || '';
      const uAns = (ans.user_answer || '').toLowerCase();
      const cAns = (ans.question?.correct_answer || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return qText.includes(query) || uAns.includes(query) || cAns.includes(query);
    }
    return true;
  });

  const scrollToQuestion = (idx: number) => {
    const el = document.getElementById(`report-question-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 pb-32 animate-fadeIn">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95 touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Back to Marks</span>
          <span className="xs:hidden">Marks</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onRetake && submission.test_id && (
            <button
              onClick={() => onRetake(submission.test_id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors shadow-sm touch-manipulation active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          )}

          {onNavigateToTests && (
            <button
              onClick={onNavigateToTests}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 transition-colors shadow-sm touch-manipulation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All Papers</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm touch-manipulation"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print Report</span>
          </button>
        </div>
      </div>

      {/* Attempt History Switcher Banner (Accessible to both User and Admin) */}
      {attemptsList.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <History className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  All Stored Attempts ({attemptsList.length})
                </span>
                <span className="text-[10px] text-slate-400">
                  Switch between past attempts anytime. All reports are permanently preserved in the DB.
                </span>
              </div>
            </div>

            {scoreDiff !== null && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${scoreDiff > 0
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : scoreDiff < 0
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                {scoreDiff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : scoreDiff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                {scoreDiff > 0 ? `+${scoreDiff.toFixed(1)}% vs Attempt #${prevAttempt?.attempt_number}` : scoreDiff < 0 ? `${scoreDiff.toFixed(1)}% vs Attempt #${prevAttempt?.attempt_number}` : `Score equal to Attempt #${prevAttempt?.attempt_number}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {attemptsList.map((att) => {
              const isViewing = att.id === submission.id || att.attempt_number === currentAttemptNumber;
              return (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => setCurrentSubmissionId(att.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 ${isViewing
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  title={`View Attempt #${att.attempt_number} submitted on ${new Date(att.submitted_at).toLocaleDateString()}`}
                >
                  <span>Attempt #{att.attempt_number}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isViewing ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                    {att.percentage}%
                  </span>
                  {isViewing && <span className="text-[10px] text-white/90 font-medium">• Viewing</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hero Performance Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl mb-6 ${isExcellent
          ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
          : isPassed
            ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700'
            : 'bg-gradient-to-br from-amber-600 via-rose-600 to-red-600'
          }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>{isExcellent ? 'Outstanding Performance' : isPassed ? 'Test Passed' : 'Assessment Completed'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white tracking-wider">
                <History className="w-3.5 h-3.5" />
                <span>Attempt #{submission.attempt_number || 1} of {totalAttempts}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {submission.test_title || 'Test Assessment'}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80 pt-1">
              {submission.user_name && (
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5" />
                  {submission.user_name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(submission.submitted_at).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {submission.time_spent_seconds ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Time: {Math.floor(submission.time_spent_seconds / 60)}m {submission.time_spent_seconds % 60}s
                </span>
              ) : null}
            </div>
          </div>

          {/* Big Score Radial Badge */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-white/15 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/25 shadow-inner">
            <span className="text-xs uppercase tracking-wider font-semibold text-white/80 mb-0.5">
              Final Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">{submission.score}</span>
              <span className="text-lg font-medium text-white/70">/ {submission.total_points}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/25 text-xs font-bold text-white shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>{submission.percentage}% Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Performance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Pass Status</span>
          <span className={`text-base sm:text-lg font-bold flex items-center justify-center gap-1 ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
            {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {isPassed ? 'Passed (≥50%)' : 'Needs Review'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Correct Answers</span>
          <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {correctCount} <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Incorrect Answers</span>
          <span className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400">
            {incorrectCount} <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Accuracy</span>
          <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {submission.percentage}%
          </span>
        </div>
      </div>

      {/* Quick Question Jump Navigator */}
      {submission.answers.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Question Navigator ({totalQuestions} Questions)
            </h3>
            <span className="text-[11px] text-slate-400">Click a number to jump</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {submission.answers.map((ans, idx) => {
              const isUnanswered = !ans.user_answer || ans.user_answer.trim() === '';
              return (
                <button
                  key={idx}
                  onClick={() => scrollToQuestion(idx + 1)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all active:scale-90 ${ans.is_correct
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : isUnanswered
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  title={`Question ${idx + 1}: ${ans.is_correct ? 'Correct' : isUnanswered ? 'Unanswered' : 'Incorrect'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
          >
            All ({totalQuestions})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === 'correct'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
          >
            Correct ({correctCount})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === 'incorrect'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
          >
            Incorrect ({incorrectCount})
          </button>
          {unansweredCount > 0 && (
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === 'unanswered'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
            >
              Unanswered ({unansweredCount})
            </button>
          )}
        </div>

        {/* Search inside report */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Question Cards Section */}
      <div className="space-y-4">
        {filteredAnswers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center text-slate-500">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No questions matched your filter
            </p>
            <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All&quot; or clearing your search term.</p>
          </div>
        ) : (
          filteredAnswers.map(({ ans, originalIndex }) => {
            const q = ans.question;
            const qNum = originalIndex + 1;
            const isUnanswered = !ans.user_answer || ans.user_answer.trim() === '';

            return (
              <div
                key={ans.id || originalIndex}
                id={`report-question-${qNum}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border transition-all shadow-sm ${ans.is_correct
                  ? 'border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-300'
                  : isUnanswered
                    ? 'border-amber-200/80 dark:border-amber-900/40 hover:border-amber-300'
                    : 'border-rose-200/80 dark:border-rose-900/40 hover:border-rose-300'
                  }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Question {qNum}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Score: {ans.points_awarded} / {q?.points || 1} pt
                    </span>
                  </div>

                  <div>
                    {ans.is_correct ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{ans.points_awarded} pts)
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5" /> Unanswered (0 pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (0 pts)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed mb-4">
                  {q?.question_text || 'Question'}
                </p>

                {/* Multiple Choice Options List (if options exist) */}
                {q?.options && q.options.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {q.options.map((option, optIdx) => {
                      const isUserChoice = ans.user_answer === option;
                      const isCorrectChoice = q.correct_answer === option;

                      let itemStyle = 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                      if (isCorrectChoice) {
                        itemStyle = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500/30';
                      } else if (isUserChoice && !ans.is_correct) {
                        itemStyle = 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium ring-1 ring-rose-500/30';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-xl border text-xs transition-colors ${itemStyle}`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 border border-current">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug pt-0.5 break-words">{option}</span>
                          </div>

                          <div className="self-end sm:self-auto shrink-0 flex items-center gap-1.5 mt-1 sm:mt-0">
                            {isCorrectChoice && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Correct Answer
                              </span>
                            )}
                            {isUserChoice && !isCorrectChoice && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" /> Your Choice
                              </span>
                            )}
                            {isUserChoice && isCorrectChoice && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                                Your Choice
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Standard text answer display */
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 mb-4 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium shrink-0">Your Answer:</span>
                      <span className={`font-semibold ${ans.is_correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {ans.user_answer || '(Unanswered)'}
                      </span>
                    </div>
                    {!ans.is_correct && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 font-medium shrink-0">Correct Answer:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {q?.correct_answer}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation Box */}
                {q?.explanation && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-indigo-950 dark:text-indigo-300 font-semibold block mb-0.5">
                        Explanation & Solution:
                      </strong>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Marks</span>
        </button>

        <div className="flex items-center gap-2">
          {onRetake && submission.test_id && (
            <button
              onClick={() => onRetake(submission.test_id)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>
          )}

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="hidden sm:inline">Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};
