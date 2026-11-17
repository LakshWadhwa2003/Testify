import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Submission } from '../types/database';
import { submissionsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TestReportView } from './TestReportView';
import {
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  Search,
  ChevronRight,
  RotateCcw,
  History,
  BarChart3,
  Clock
} from 'lucide-react';

interface MarksViewProps {
  onSelectSubmission?: (submissionId: string) => void;
  onRetakeTest?: (testId: string) => void;
  onNavigateToTests?: () => void;
}

type FilterMode = 'all' | 'latest' | 'retakes';

export const MarksView: React.FC<MarksViewProps> = ({
  onSelectSubmission,
  onRetakeTest,
  onNavigateToTests,
}) => {
  const { user, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>('all');
  const [selectedTestId, setSelectedTestId] = useState<string>('all');

  const fetchMarks = useCallback(async () => {
    setLoading(true);
    try {
      // If admin, fetch all submissions. If student, only fetch their submissions.
      const data = await submissionsService.getSubmissions(isAdmin ? undefined : user?.id);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch marks', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  // Map of test_id -> all attempts for that test sorted newest to oldest by submitted_at
  const attemptsByTest = useMemo(() => {
    const map = new Map<string, Submission[]>();
    for (const s of submissions) {
      const list = map.get(s.test_id) || [];
      list.push(s);
      map.set(s.test_id, list);
    }
    for (const [testId, list] of map.entries()) {
      map.set(testId, list.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()));
    }
    return map;
  }, [submissions]);

  // Map of test_id -> the single latest Submission for that test (strictly newest by submitted_at)
  const latestSubmissionByTest = useMemo(() => {
    const map = new Map<string, Submission>();
    for (const s of submissions) {
      const existing = map.get(s.test_id);
      if (!existing || new Date(s.submitted_at).getTime() > new Date(existing.submitted_at).getTime()) {
        map.set(s.test_id, s);
      }
    }
    return map;
  }, [submissions]);

  // Map of (user_id + test_id) -> attempts sorted ascending by attempt_number for progression comparison
  const attemptsByUserAndTest = useMemo(() => {
    const map = new Map<string, Submission[]>();
    for (const s of submissions) {
      const key = `${s.user_id || 'guest'}_${s.test_id}`;
      const list = map.get(key) || [];
      list.push(s);
      map.set(key, list);
    }
    for (const [key, list] of map.entries()) {
      map.set(key, list.sort((a, b) => (a.attempt_number || 1) - (b.attempt_number || 1)));
    }
    return map;
  }, [submissions]);

  // Map of (user_id + test_id) -> the single latest Submission for that user and test
  const latestSubmissionByUserAndTest = useMemo(() => {
    const map = new Map<string, Submission>();
    for (const s of submissions) {
      const key = `${s.user_id || 'guest'}_${s.test_id}`;
      const existing = map.get(key);
      if (!existing || new Date(s.submitted_at).getTime() > new Date(existing.submitted_at).getTime()) {
        map.set(key, s);
      }
    }
    return map;
  }, [submissions]);

  // Unique students and tests for admin filters
  const uniqueStudents = useMemo(() => {
    const map = new Map<string, { email: string; name: string }>();
    for (const s of submissions) {
      const email = s.user_email || 'unknown';
      if (!map.has(email)) {
        map.set(email, { email, name: s.user_name || email });
      }
    }
    return Array.from(map.values());
  }, [submissions]);

  const uniqueTests = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of submissions) {
      if (!map.has(s.test_id)) {
        map.set(s.test_id, s.test_title || 'Assessment Test');
      }
    }
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [submissions]);

  // Calculations for summary stats
  const totalSubmissions = submissions.length;
  const avgPercentage = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / totalSubmissions)
    : 0;
  const passedCount = submissions.filter(s => s.percentage >= 50).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

  // Total unique tests attempted
  const uniqueTestsAttempted = useMemo(() => {
    return new Set(submissions.map(s => s.test_id)).size;
  }, [submissions]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const term = searchTerm.toLowerCase();
      const testMatch = s.test_title?.toLowerCase().includes(term);
      const userMatch = s.user_name?.toLowerCase().includes(term) || s.user_email?.toLowerCase().includes(term);
      const attemptMatch = `attempt ${s.attempt_number}`.includes(term) || `#${s.attempt_number}`.includes(term);
      const matchesSearch = testMatch || userMatch || attemptMatch;

      if (!matchesSearch) return false;

      // Admin student filter
      if (isAdmin && selectedStudentEmail !== 'all' && s.user_email !== selectedStudentEmail) {
        return false;
      }

      // Test filter
      if (selectedTestId !== 'all' && s.test_id !== selectedTestId) {
        return false;
      }

      // Filter modes
      if (filterMode === 'latest') {
        if (isAdmin && selectedStudentEmail !== 'all') {
          const userKey = `${s.user_id || 'guest'}_${s.test_id}`;
          return s.id === latestSubmissionByUserAndTest.get(userKey)?.id;
        }
        return s.id === latestSubmissionByTest.get(s.test_id)?.id;
      }

      if (filterMode === 'retakes') {
        const testAttempts = attemptsByTest.get(s.test_id) || [];
        return testAttempts.length > 1;
      }

      return true;
    });
  }, [submissions, searchTerm, filterMode, selectedStudentEmail, selectedTestId, isAdmin, attemptsByTest, latestSubmissionByTest, latestSubmissionByUserAndTest]);

  // If a submission is selected internally, render the End Report on a separate page
  if (selectedSubmissionId) {
    return (
      <TestReportView
        submissionId={selectedSubmissionId}
        onBack={() => setSelectedSubmissionId(null)}
        onRetake={onRetakeTest}
        onNavigateToTests={onNavigateToTests}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 pb-28">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{isAdmin ? 'Class Marks & Submissions' : 'My Marks & Attempt History'}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {totalSubmissions} {totalSubmissions === 1 ? 'Attempt' : 'Attempts'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAdmin
              ? 'All student test attempts are permanently stored. View attempt progression, retake reports, and solutions.'
              : 'All your past and retake attempts are saved in the DB. Review any attempt score and answers anytime.'}
          </p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Total Attempts
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {totalSubmissions}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Unique Tests
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {uniqueTestsAttempted}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Average Score
          </span>
          <span className={`text-xl sm:text-2xl font-bold ${avgPercentage >= 70 ? 'text-emerald-600' : avgPercentage >= 50 ? 'text-amber-600' : 'text-slate-900 dark:text-white'
            }`}>
            {avgPercentage}%
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Pass Rate (≥50%)
          </span>
          <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {passRate}%
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={isAdmin ? "Search by student name, test title, or attempt..." : "Search past attempts or tests..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Filter Pills & Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700 overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation active:scale-95 ${filterMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilterMode('latest')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation active:scale-95 ${filterMode === 'latest'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              Latest Only
            </button>
            <button
              onClick={() => setFilterMode('retakes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation active:scale-95 ${filterMode === 'retakes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              Retaken Tests
            </button>
          </div>

          {/* Admin Filters: Student and Test Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && uniqueStudents.length > 1 && (
              <select
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-base sm:text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                <option value="all">All Students ({uniqueStudents.length})</option>
                {uniqueStudents.map(st => (
                  <option key={st.email} value={st.email}>
                    {st.name}
                  </option>
                ))}
              </select>
            )}

            {uniqueTests.length > 1 && (
              <select
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-base sm:text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm max-w-full sm:max-w-[200px] truncate"
              >
                <option value="all">All Tests ({uniqueTests.length})</option>
                {uniqueTests.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs text-slate-400">Loading attempts from DB...</span>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center text-slate-500">
          <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No attempts found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm || filterMode !== 'all' || selectedStudentEmail !== 'all' || selectedTestId !== 'all'
              ? 'Try adjusting your search query or filter options.'
              : isAdmin
                ? 'When students submit or retake tests, all their attempt reports will be preserved and accessible here.'
                : 'Complete a test paper to view your marks and solutions! All subsequent retakes will also be preserved.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => {
            const isHigh = sub.percentage >= 80;
            const isPassing = sub.percentage >= 50;

            // Total attempts for this test
            const testAttempts = attemptsByTest.get(sub.test_id) || [];
            const hasMultipleAttempts = testAttempts.length > 1;

            // Strict single latest check:
            // If admin filtered by a specific student, match latest for that student.
            // Otherwise, match the single newest submission for this test across the list.
            const isLatest = hasMultipleAttempts && (
              isAdmin && selectedStudentEmail !== 'all'
                ? sub.id === latestSubmissionByUserAndTest.get(`${sub.user_id || 'guest'}_${sub.test_id}`)?.id
                : sub.id === latestSubmissionByTest.get(sub.test_id)?.id
            );

            // Find immediate previous attempt for score progression
            const userKey = `${sub.user_id || 'guest'}_${sub.test_id}`;
            const userAttempts = attemptsByUserAndTest.get(userKey) || [];
            const prevAttempt = userAttempts.find(a => (a.attempt_number || 1) === (sub.attempt_number || 1) - 1);
            const scoreDiff = prevAttempt !== undefined ? sub.percentage - prevAttempt.percentage : null;

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubmission ? onSelectSubmission(sub.id) : setSelectedSubmissionId(sub.id)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  {/* Title & Attempt Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sub.test_title || 'Test Paper'}
                    </h3>

                    {/* Attempt Number Badge */}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isLatest
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                      <History className="w-3 h-3" />
                      <span>Attempt #{sub.attempt_number || 1}</span>
                      {isLatest && hasMultipleAttempts && <span className="opacity-75">• Latest</span>}
                    </span>

                    {/* Score badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHigh
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : isPassing
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                      {sub.percentage}%
                    </span>

                    {/* Score difference indicator if retake */}
                    {scoreDiff !== null && (
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${scoreDiff > 0
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : scoreDiff < 0
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300'
                        }`}>
                        {scoreDiff > 0 ? <TrendingUp className="w-3 h-3" /> : scoreDiff < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                        {scoreDiff > 0 ? `+${scoreDiff.toFixed(1)}%` : scoreDiff < 0 ? `${scoreDiff.toFixed(1)}%` : 'Same'}
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-400">
                    {isAdmin && (
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <User className="w-3 h-3 text-slate-400" />
                        {sub.user_name || sub.user_email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sub.submitted_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {sub.time_spent_seconds ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Time: {Math.floor(sub.time_spent_seconds / 60)}m {sub.time_spent_seconds % 60}s
                      </span>
                    ) : null}
                    {hasMultipleAttempts && (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {userAttempts.length} total attempts stored
                      </span>
                    )}
                  </div>
                </div>

                {/* Score badge & Arrow Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {sub.score} <span className="text-xs font-normal text-slate-400">/ {sub.total_points}</span>
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1 justify-start sm:justify-end">
                      <span>View Report #{sub.attempt_number || 1}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {onRetakeTest && isLatest && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetakeTest(sub.test_id);
                        }}
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                        title="Retake this test (creates new attempt)"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
