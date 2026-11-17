import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TestPaper, Submission } from '../types/database';
import { testsService, submissionsService, userTestAccessService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  HelpCircle,
  Award,
  Play,
  Trash2,
  Search,
  Edit3,
  RotateCcw,
  CheckCircle2,
  History,
  FileText,
  Lock,
  Users,
  Plus
} from 'lucide-react';

interface TestsCatalogViewProps {
  onStartTest: (testId: string) => void;
  onEditTest?: (testId: string) => void;
  onViewReports?: (testId?: string) => void;
  onManageUsers?: (testId?: string) => void;
  onCreateTest?: () => void;
}

export const TestsCatalogView: React.FC<TestsCatalogViewProps> = ({
  onStartTest,
  onEditTest,
  onViewReports,
  onManageUsers,
  onCreateTest,
}) => {
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState<TestPaper[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userAccessMap, setUserAccessMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const promises: [Promise<TestPaper[]>, Promise<Submission[]>, Promise<Record<string, boolean>>] = [
        testsService.getTests(isAdmin),
        submissionsService.getSubmissions(isAdmin ? undefined : user?.id),
        (!isAdmin && user?.id)
          ? userTestAccessService.getUserAccessMap(user.id)
          : Promise.resolve({}),
      ];

      const [testsData, subsData, accessData] = await Promise.all(promises);
      setTests(testsData);
      setSubmissions(subsData);
      setUserAccessMap(accessData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Group submissions by test_id (sorted newest to oldest by submitted_at)
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

  const handleDelete = async (testId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this test paper? All its questions will be removed.')) {
      return;
    }
    try {
      await testsService.deleteTest(testId);
      setTests((prev) => prev.filter((t) => t.id !== testId));
    } catch (err: any) {
      alert('Failed to delete test: ' + (err?.message || 'Unknown error'));
    }
  };

  const categories = ['All', ...Array.from(new Set(tests.map((t) => t.category || 'General')))];

  const lockedCount = useMemo(() => {
    if (isAdmin) return 0;
    return tests.filter((t) => userAccessMap[t.id] !== true).length;
  }, [tests, userAccessMap, isAdmin]);

  const filteredTests = tests.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const isTestActive = isAdmin || userAccessMap[t.id] === true;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && isTestActive) ||
      (statusFilter === 'locked' && !isTestActive);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 pb-28">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? 'Manage Test Papers' : 'Available Assessments'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAdmin
              ? 'Configure test papers, upload new tests, manage status and student access.'
              : 'Select a questionnaire to start and get immediate score marks.'}
          </p>
        </div>

        {isAdmin && onCreateTest && (
          <button
            type="button"
            onClick={onCreateTest}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-indigo-600/25 transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span>Create Test Paper</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search assessments by title or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Categories & Student Access Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none flex-1 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation ${selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {!isAdmin && lockedCount > 0 && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all touch-manipulation ${statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
              >
                All ({tests.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all touch-manipulation ${statusFilter === 'active'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
              >
                Active ({tests.length - lockedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('locked')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all touch-manipulation ${statusFilter === 'locked'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
              >
                Locked ({lockedCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs text-slate-400">Loading tests...</span>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center text-slate-500">
          <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No test papers found</p>
          <p className="text-xs text-slate-400 mt-1">
            Check back later for new published assessments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((test) => {
            const isTestActive = isAdmin || userAccessMap[test.id] === true;
            const testAttempts = attemptsByTest.get(test.id) || [];
            const hasAttempts = testAttempts.length > 0;
            const bestPercentage = hasAttempts ? Math.max(...testAttempts.map(a => a.percentage)) : 0;
            const latestAttempt = hasAttempts ? testAttempts[0] : null;

            return (
              <div
                key={test.id}
                className={`rounded-3xl p-5 border shadow-sm transition-all flex flex-col justify-between ${!isTestActive
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-amber-200/80 dark:border-amber-900/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md'
                  }`}
              >
                <div>
                  {/* Header row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {test.category || 'General'}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {onManageUsers && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onManageUsers(test.id);
                            }}
                            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700 transition-all active:scale-95 shadow-xs touch-manipulation"
                            title="Manage user test access"
                          >
                            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Access</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTest?.(test.id);
                          }}
                          className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700 transition-all active:scale-95 shadow-xs touch-manipulation"
                          title="Edit test questions and timer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(test.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors touch-manipulation"
                          title="Delete test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug mb-1">
                    {test.title}
                  </h3>
                  {test.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {test.description}
                    </p>
                  )}

                  {/* Deactivated/Locked Banner for Student */}
                  {!isTestActive && (
                    <div className="my-3 p-2.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                      <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div>
                        <span className="font-semibold block">Deactivated for your account</span>
                        <span className="text-[10px] text-amber-700/90 dark:text-amber-400/90">
                          Your instructor has paused or locked this test for you.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Attempt Status Banner for Student */}
                  {!isAdmin && isTestActive && hasAttempts && (
                    <div className="my-3 p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Completed ({testAttempts.length} {testAttempts.length === 1 ? 'Attempt' : 'Attempts'})
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Latest: {latestAttempt?.percentage}% • Best: {bestPercentage}%
                          </span>
                        </div>
                      </div>
                      {onViewReports && (
                        <button
                          type="button"
                          onClick={() => onViewReports(test.id)}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg hover:bg-indigo-100/60 transition-colors"
                          title="View all past attempt reports in Marks"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Reports</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Attempt Status Banner for Admin */}
                  {isAdmin && (
                    <div className="my-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        {testAttempts.length} {testAttempts.length === 1 ? 'Student Submission' : 'Student Submissions'}
                      </span>
                      {onViewReports && testAttempts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onViewReports(test.id)}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View Marks
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta info & Action button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {test.duration_minutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      {test.total_points} Pts
                    </span>
                    {test.question_count !== undefined && (
                      <span className="text-[11px] text-slate-400">
                        {test.question_count} Qs
                      </span>
                    )}
                  </div>

                  {!isTestActive ? (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      title="This test is currently deactivated for your account."
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStartTest(test.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                    >
                      {!isAdmin && hasAttempts ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake Test</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isAdmin ? 'Preview' : 'Start Test'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
