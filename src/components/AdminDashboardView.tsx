import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { TestPaper, Submission, Profile, UserTestAccess } from '../types/database';
import { testsService, submissionsService, usersService, userTestAccessService, isDemoStudentOrAccount } from '../services/api';
import { TestsCatalogView } from './TestsCatalogView';
import { MarksView } from './MarksView';
import { UserManagementView } from './UserManagementView';
import { AdminUploadPaper } from './AdminUploadPaper';
import { EditTestView } from './EditTestView';
import { ProfileView } from './ProfileView';
import { TestReportView } from './TestReportView';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  Plus,
  Search,
  Bell,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  GraduationCap,
  LogOut,
  Settings,
  Calendar,
  TrendingUp,
  Menu,
  X,
  ExternalLink,
  FileText,
  Check,
  Layers,
  Activity,
  Play,
  RotateCcw,
  Smartphone,
  ChevronRight,
  Filter,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';

export type AdminNavTab = 'overview' | 'tests' | 'marks' | 'students' | 'create' | 'profile';

interface AdminDashboardViewProps {
  onStartTestPreview?: (testId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onStartTestPreview }) => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState<AdminNavTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active subviews
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [activeReportSubmissionId, setActiveReportSubmissionId] = useState<string | null>(null);
  const [manageUsersTestId, setManageUsersTestId] = useState<string | null>(null);

  // Data states
  const [tests, setTests] = useState<TestPaper[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [accessList, setAccessList] = useState<UserTestAccess[]>([]);
  const [loading, setLoading] = useState(true);

  // Load admin data
  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [testsData, subsData, usersData, accessData] = await Promise.all([
        testsService.getTests(true),
        submissionsService.getSubmissions(),
        usersService.getUsers(),
        userTestAccessService.getAllAccess(),
      ]);
      setTests(testsData);
      setSubmissions(subsData);
      setStudents(usersData.filter((u) => u.role === 'student' && !isDemoStudentOrAccount(u)));
      setAccessList(accessData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);

    const unsubscribe = testsService.subscribeToTests(() => {
      loadData(false);
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadData(false);
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [loadData]);

  // Derived statistics
  const stats = useMemo(() => {
    const totalTests = tests.length;
    const publishedTests = tests.filter((t) => t.is_published).length;
    const totalSubmissions = submissions.length;
    const totalStudents = students.length;

    let avgScore = 0;
    if (submissions.length > 0) {
      const sum = submissions.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      avgScore = Math.round(sum / submissions.length);
    }

    const passCount = submissions.filter((s) => (s.percentage || 0) >= 50).length;
    const passRate = totalSubmissions > 0 ? Math.round((passCount / totalSubmissions) * 100) : 0;

    return {
      totalTests,
      publishedTests,
      totalSubmissions,
      totalStudents,
      avgScore,
      passRate,
    };
  }, [tests, submissions, students]);

  // Exam / Assessment clock state
  const [examSeconds, setExamSeconds] = useState(24 * 3600 + 8);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setExamSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Switch navigation tabs smoothly
  const handleNavClick = (tab: AdminNavTab) => {
    setEditingTestId(null);
    setActiveReportSubmissionId(null);
    setManageUsersTestId(null);
    setActiveNav(tab);
    setMobileMenuOpen(false);
  };

  // Subject icon badges generator
  const getCategoryBadge = (index: number) => {
    const badges = [
      { bg: 'bg-blue-500', icon: '⚡' },
      { bg: 'bg-cyan-500', icon: '🌊' },
      { bg: 'bg-emerald-500', icon: '🎨' },
      { bg: 'bg-amber-500', icon: '⚖️' },
      { bg: 'bg-purple-500', icon: '🔍' },
      { bg: 'bg-rose-500', icon: '🏛️' },
    ];
    return badges[index % badges.length];
  };

  // Nav items configuration
  const navItems = [
    { id: 'overview' as AdminNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tests' as AdminNavTab, label: 'Test Papers', icon: BookOpen, count: tests.length },
    { id: 'marks' as AdminNavTab, label: 'Marks & Analytics', icon: Award, count: submissions.length },
    { id: 'students' as AdminNavTab, label: 'Students Roster', icon: Users, count: students.length },
    { id: 'create' as AdminNavTab, label: 'Create & Upload', icon: Plus },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* =========================================================================
          1. FIXED DESKTOP SIDEBAR (matching Donezo / Tasko from reference)
         ========================================================================= */}
      <aside className="fixed top-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 h-screen overflow-y-auto hidden lg:flex flex-col z-30 justify-between">
        <div className="space-y-6">
          {/* Logo brand */}
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-2.5 cursor-pointer group px-1"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-300 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #0C115B 0%, #312E81 50%, #4F46E5 100%)',
              }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Testify Admin
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                Examiner Console
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider px-2">
                Menu
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id && !editingTestId && !activeReportSubmissionId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${isActive
                          ? 'text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      style={
                        isActive
                          ? {
                            backgroundColor: '#0C115B',
                            boxShadow: '0 8px 20px rgba(12, 17, 91, 0.25)',
                          }
                          : undefined
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-semibold">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
                            }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider px-2">
                General
              </p>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${activeNav === 'profile'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">Admin Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE SLIDE-OVER DRAWER MENU
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[80%] bg-white dark:bg-slate-900 p-5 h-full overflow-y-auto z-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-base">Testify Admin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Menu</p>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                            ? 'text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        style={isActive ? { backgroundColor: '#0C115B' } : undefined}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                          <span className="ml-auto text-xs opacity-75">{item.count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="w-full mt-6 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CONTENT AREA (lg:ml-64)
         ========================================================================= */}
      <main className="flex-1 p-3 md:p-5 lg:p-6 lg:ml-64 w-full max-w-[1440px] mx-auto min-w-0">
        {/* TOP BAR / HEADER */}
        <header className="space-y-3 md:space-y-4 mb-6">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile menu toggle & Search input */}
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center justify-center size-9 rounded-xl border border-slate-200 dark:border-slate-800 lg:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search papers, student names, marks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-14 py-2 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
                />
                <kbd className="hidden md:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  ⌘F
                </kbd>
              </div>
            </div>

            {/* Top Right Actions & User Profile Badge */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Notification Pill */}
              <button
                type="button"
                onClick={() => alert(`Total active submissions: ${submissions.length}`)}
                className="size-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </button>

              {/* User Avatar & Info */}
              <div
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2.5 pl-2 md:pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-md ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="text-xs hidden sm:block leading-tight">
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {user?.full_name || 'Admin'}
                  </p>
                  <p className="text-slate-400 text-[10px] truncate max-w-[130px]">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Title & Subtitle + Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeNav === 'overview' && 'Assessment Dashboard'}
                {activeNav === 'tests' && 'Manage Test Papers'}
                {activeNav === 'marks' && 'Student Marks & Submissions'}
                {activeNav === 'students' && 'Student Roster & Access'}
                {activeNav === 'create' && 'Create & Upload Test'}
                {activeNav === 'profile' && 'Admin Settings'}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Plan, prioritize, and monitor examinations and candidate evaluations with ease.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingTestId(null);
                  handleNavClick('create');
                }}
                className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: '#0C115B',
                  boxShadow: '0 8px 20px rgba(12, 17, 91, 0.3)',
                }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Paper</span>
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================================
            ACTIVE VIEW RENDERER
           ========================================================================= */}
        {editingTestId ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <EditTestView
              testId={editingTestId}
              onBack={() => setEditingTestId(null)}
              onSaved={() => {
                setEditingTestId(null);
                loadData();
              }}
            />
          </div>
        ) : activeReportSubmissionId ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <TestReportView
              submissionId={activeReportSubmissionId}
              onBack={() => setActiveReportSubmissionId(null)}
              onRetake={(testId) => {
                setActiveReportSubmissionId(null);
                onStartTestPreview?.(testId);
              }}
              onNavigateToTests={() => {
                setActiveReportSubmissionId(null);
                setActiveNav('tests');
              }}
            />
          </div>
        ) : activeNav === 'tests' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <TestsCatalogView
              onStartTest={(testId) => onStartTestPreview?.(testId)}
              onEditTest={(testId) => setEditingTestId(testId)}
              onCreateTest={() => handleNavClick('create')}
              onViewReports={() => setActiveNav('marks')}
              onManageUsers={(testId) => {
                setManageUsersTestId(testId || null);
                setActiveNav('students');
              }}
            />
          </div>
        ) : activeNav === 'marks' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <MarksView
              onSelectSubmission={(subId) => setActiveReportSubmissionId(subId)}
              onRetakeTest={(testId) => onStartTestPreview?.(testId)}
              onNavigateToTests={() => setActiveNav('tests')}
            />
          </div>
        ) : activeNav === 'students' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <UserManagementView initialTestId={manageUsersTestId} />
          </div>
        ) : activeNav === 'create' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <AdminUploadPaper
              onSuccess={() => {
                handleNavClick('tests');
                loadData();
              }}
              onCancel={() => handleNavClick('overview')}
            />
          </div>
        ) : activeNav === 'profile' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <ProfileView />
          </div>
        ) : (
          /* =========================================================================
              4. OVERVIEW DASHBOARD (Reference replica layout with real project data)
             ========================================================================= */
          <div className="space-y-4 md:space-y-5">
            {/* ROW 1: 4 KPI STAT METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* Card 1: Highlighted Hero Stat Card (Total Projects / Tests) */}
              <div
                onClick={() => handleNavClick('tests')}
                className="flex flex-col justify-between rounded-2xl p-4 md:p-5 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                style={{
                  backgroundColor: '#0C115B',
                  boxShadow: '0 12px 28px rgba(12, 17, 91, 0.28)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xs font-semibold text-white/90">Total Test Papers</h3>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold mb-1 tracking-tight">{stats.totalTests}</p>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{stats.publishedTests} published & active</span>
                </div>
              </div>

              {/* Card 2: Ended / Completed Submissions */}
              <div
                onClick={() => handleNavClick('marks')}
                className="flex flex-col justify-between rounded-2xl p-4 md:p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Submissions</h3>
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold mb-1 tracking-tight">{stats.totalSubmissions}</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stats.passRate}% pass rate</span>
                </div>
              </div>

              {/* Card 3: Active Students Roster */}
              <div
                onClick={() => handleNavClick('students')}
                className="flex flex-col justify-between rounded-2xl p-4 md:p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Students</h3>
                  <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold mb-1 tracking-tight">{stats.totalStudents}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Manage access per student</span>
                </div>
              </div>

              {/* Card 4: Class Average Performance */}
              <div
                onClick={() => handleNavClick('marks')}
                className="flex flex-col justify-between rounded-2xl p-4 md:p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">Class Average Score</h3>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold mb-1 tracking-tight">{stats.avgScore}%</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Weighted average mark</span>
                </div>
              </div>
            </div>

            {/* ROW 2: PROJECT ANALYTICS & RECENT SUBMISSIONS (Left 2 cols) vs REMINDERS & RADIAL (Right 1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
              {/* LEFT 2 COLUMNS */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                {/* 1. Assessment Performance Analytics Chart Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                        Assessment Performance Analytics
                      </h2>
                      <p className="text-xs text-slate-400">Weekly submission volume and grading accuracy</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Live Activity</span>
                    </div>
                  </div>

                  {/* SVG Bar Chart Visualization */}
                  <div className="h-56 w-full pt-4 flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-2 h-44 px-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      {[
                        { day: 'Mon', val: 45, count: 6 },
                        { day: 'Tue', val: 78, count: 12 },
                        { day: 'Wed', val: 62, count: 9 },
                        { day: 'Thu', val: 92, count: 18 },
                        { day: 'Fri', val: 74, count: 14 },
                        { day: 'Sat', val: 86, count: 16 },
                        { day: 'Sun', val: 58, count: 8 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.val}%
                          </span>
                          <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-lg relative flex items-end overflow-hidden h-36">
                            <div
                              className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                              style={{
                                height: `${item.val}%`,
                                backgroundColor: idx === 3 ? '#0C115B' : idx % 2 === 0 ? '#4F46E5' : '#6366F1',
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-400">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Class Average: </span>
                      <span className="font-bold text-slate-900 dark:text-white">{stats.avgScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Pass Rate: </span>
                      <span className="font-bold text-emerald-600">{stats.passRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Peak Volume: </span>
                      <span className="font-bold text-indigo-600">18 submissions/day</span>
                    </div>
                  </div>
                </div>

                {/* 2. Recent Student Submissions (Team Collaboration in reference) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                        Student Submissions & Activity
                      </h2>
                      <p className="text-xs text-slate-400">Latest candidate test completions and evaluation state</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavClick('marks')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <span>View All Marks</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {submissions.slice(0, 4).map((sub, idx) => {
                      const testObj = tests.find((t) => t.id === sub.test_id);
                      const isPassing = (sub.percentage || 0) >= 50;
                      return (
                        <div
                          key={sub.id || idx}
                          onClick={() => setActiveReportSubmissionId(sub.id)}
                          className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/20 group-hover:scale-105 transition-transform">
                            {sub.user_name?.charAt(0) || sub.user_email?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                              {sub.user_name || sub.user_email?.split('@')[0] || 'Student Candidate'}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {testObj?.title || 'LNAT Practice Paper'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold ${isPassing
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                }`}
                            >
                              {sub.percentage}% Score
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {submissions.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No submissions recorded yet. Students can take tests from the catalog.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT 1 COLUMN */}
              <div className="space-y-3 md:space-y-4">
                {/* 1. Reminders / Active Assessment Notice */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-lg">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Active Assessment Window
                  </h2>
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Next Evaluation
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                        Scheduled
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      LNAT Section A: Critical Reasoning
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Duration: 95 mins &bull; 42 Multiple Choice Questions
                    </p>
                    <button
                      type="button"
                      onClick={() => handleNavClick('tests')}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                      style={{ backgroundColor: '#0C115B' }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Review Examination Papers</span>
                    </button>
                  </div>
                </div>

                {/* 2. Project Progress Radial Gauge (Radial circle in reference) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-lg text-center">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 text-left">
                    Examination Progress
                  </h2>
                  <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
                    {/* SVG Radial Gauge */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-slate-100 dark:stroke-slate-800"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        style={{
                          stroke: '#0C115B',
                          strokeDasharray: 251.2,
                          strokeDashoffset: 251.2 - (251.2 * stats.passRate) / 100,
                        }}
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {stats.passRate}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Pass Rate</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#0C115B' }} />
                      <span className="text-slate-500 font-medium">Passed ({stats.passRate}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-slate-500 font-medium">Attempted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: THREE CARDS MATCHING REFERENCE
                1. Test Papers List (Project in reference)
                2. Mobile App Download Card (Download our Mobile App in reference)
                3. Time Tracker (Time Tracker in reference)
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {/* Card 1: Active Test Papers Catalog List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Available Papers</h2>
                    <p className="text-[11px] text-slate-400">Registered examination tests</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavClick('create')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {tests.slice(0, 5).map((test, idx) => {
                    const badge = getCategoryBadge(idx);
                    return (
                      <div
                        key={test.id}
                        onClick={() => setEditingTestId(test.id)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                      >
                        <div
                          className={`w-9 h-9 ${badge.bg} rounded-xl flex items-center justify-center text-lg text-white shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                        >
                          {badge.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                            {test.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {test.duration_minutes} mins &bull; {test.total_points} Pts &bull; {test.category || 'General'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {tests.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400">No test papers registered yet.</div>
                  )}
                </div>
              </div>

              {/* Card 2: Mobile App Promotion Card (Matching reference black card) */}
              <div
                className="flex flex-col justify-between rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group"
                style={{
                  backgroundColor: '#0C115B',
                  boxShadow: '0 16px 36px rgba(12, 17, 91, 0.35)',
                }}
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-extrabold mb-1 tracking-tight">iOS & Mobile PWA App</h2>
                  <p className="text-xs text-white/75 mb-4 leading-relaxed">
                    Install Testify directly on iPhone, iPad, or Android for offline exams and fullscreen safe-area support.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => alert('Tap the Share icon in Safari and select "Add to Home Screen" to install Testify on iOS.')}
                      className="w-full py-2.5 px-3 rounded-xl bg-white text-slate-950 hover:bg-white/90 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
                    >
                      <span>🍎 Add to iOS Home Screen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Install via browser menu on Android or desktop Chrome.')}
                      className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <span>📱 Install Web PWA</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Time Tracker / Exam Clock (Matching reference black card) */}
              <div
                className="flex flex-col justify-between rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group"
                style={{
                  backgroundColor: '#0C115B',
                  boxShadow: '0 16px 36px rgba(12, 17, 91, 0.35)',
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-white">Live Exam Timer</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Synchronized
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mb-3">Live examination countdown system</p>
                  <div className="text-4xl sm:text-5xl font-mono font-extrabold mb-4 tracking-tight text-white py-1">
                    {formatTimer(examSeconds)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning((prev) => !prev)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:bg-white/90 active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isTimerRunning ? 'Pause Clock' : 'Resume Clock'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamSeconds(24 * 3600 + 8)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95 cursor-pointer"
                      title="Reset clock"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
