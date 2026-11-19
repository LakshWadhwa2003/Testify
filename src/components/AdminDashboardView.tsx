import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
import { ThemeToggle } from './ThemeToggle';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  Plus,
  Search,
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilterTab, setSearchFilterTab] = useState<'all' | 'papers' | 'students' | 'marks'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Switch navigation tabs smoothly
  const handleNavClick = (tab: AdminNavTab) => {
    setEditingTestId(null);
    setActiveReportSubmissionId(null);
    setManageUsersTestId(null);
    setActiveNav(tab);
    setMobileMenuOpen(false);
  };

  // Keyboard shortcut for search (⌘F / Ctrl+F or ⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'f' || e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-entity search results calculation
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        tests: [],
        students: [],
        submissions: [],
        totalCount: 0,
      };
    }

    const matchedTests = tests.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    });

    const matchedStudents = students.filter((s) => {
      return (
        (s.full_name && s.full_name.toLowerCase().includes(q)) ||
        s.email.toLowerCase().includes(q)
      );
    });

    const matchedSubmissions = submissions.filter((s) => {
      const testObj = tests.find((t) => t.id === s.test_id);
      return (
        (s.user_name && s.user_name.toLowerCase().includes(q)) ||
        (s.user_email && s.user_email.toLowerCase().includes(q)) ||
        (s.test_title && s.test_title.toLowerCase().includes(q)) ||
        (testObj?.title && testObj.title.toLowerCase().includes(q)) ||
        `${s.percentage}%`.includes(q) ||
        `attempt ${s.attempt_number}`.includes(q)
      );
    });

    return {
      tests: matchedTests,
      students: matchedStudents,
      submissions: matchedSubmissions,
      totalCount: matchedTests.length + matchedStudents.length + matchedSubmissions.length,
    };
  }, [searchQuery, tests, students, submissions]);

  // Overview tab filtered items
  const overviewTests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tests.slice(0, 5);
    return tests.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  }, [tests, searchQuery]);

  const overviewSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return submissions.slice(0, 4);
    return submissions.filter((s) => {
      const testObj = tests.find((t) => t.id === s.test_id);
      return (
        (s.user_name && s.user_name.toLowerCase().includes(q)) ||
        (s.user_email && s.user_email.toLowerCase().includes(q)) ||
        (s.test_title && s.test_title.toLowerCase().includes(q)) ||
        (testObj?.title && testObj.title.toLowerCase().includes(q)) ||
        `${s.percentage}%`.includes(q)
      );
    });
  }, [submissions, tests, searchQuery]);

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
                Appearance
              </p>
              <div className="px-2 mb-3">
                <ThemeToggle variant="pill" className="w-full justify-between" />
              </div>

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

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Appearance</span>
              <ThemeToggle variant="pill" />
            </div>

            <button
              onClick={() => logout()}
              className="w-full mt-4 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-2"
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

              <div ref={searchContainerRef} className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search papers, student names, marks..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  className="w-full pl-9 pr-14 py-2 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd
                    onClick={() => {
                      searchInputRef.current?.focus();
                      setIsSearchOpen(true);
                    }}
                    className="hidden md:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer select-none"
                  >
                    ⌘F
                  </kbd>
                )}

                {/* Instant Search Results Dropdown */}
                {isSearchOpen && searchQuery.trim() && (
                  <div className="absolute left-0 right-0 sm:-right-24 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[75vh] flex flex-col backdrop-blur-xl">
                    {/* Filter Tabs Header */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                        <button
                          type="button"
                          onClick={() => setSearchFilterTab('all')}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                            searchFilterTab === 'all'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          All ({searchResults.totalCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchFilterTab('papers')}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                            searchFilterTab === 'papers'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          Papers ({searchResults.tests.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchFilterTab('students')}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                            searchFilterTab === 'students'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          Students ({searchResults.students.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchFilterTab('marks')}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                            searchFilterTab === 'marks'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          Marks ({searchResults.submissions.length})
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSearchOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title="Close results"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Results Body */}
                    <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh]">
                      {searchResults.totalCount === 0 ? (
                        <div className="p-8 text-center">
                          <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            No matches found for &quot;{searchQuery}&quot;
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Try searching with a paper title, subject topic, student name, or email.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Test Papers List */}
                          {(searchFilterTab === 'all' || searchFilterTab === 'papers') && searchResults.tests.length > 0 && (
                            <div className="p-2">
                              <div className="flex items-center justify-between px-2 py-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <BookOpen className="w-3 h-3 text-indigo-500" />
                                  Test Papers ({searchResults.tests.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    handleNavClick('tests');
                                  }}
                                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                                >
                                  View all in Papers
                                </button>
                              </div>
                              <div className="space-y-1">
                                {searchResults.tests.map((test) => (
                                  <div
                                    key={test.id}
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setEditingTestId(test.id);
                                    }}
                                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        {test.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                                          {test.category || 'General'}
                                        </span>
                                        <span>{test.duration_minutes} mins</span>
                                        <span>&bull;</span>
                                        <span>{test.total_points} pts</span>
                                        {test.is_published ? (
                                          <span className="text-emerald-600 font-medium">Published</span>
                                        ) : (
                                          <span className="text-slate-400 font-medium">Draft</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsSearchOpen(false);
                                          onStartTestPreview?.(test.id);
                                        }}
                                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                      >
                                        Preview
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsSearchOpen(false);
                                          setEditingTestId(test.id);
                                        }}
                                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Students List */}
                          {(searchFilterTab === 'all' || searchFilterTab === 'students') && searchResults.students.length > 0 && (
                            <div className="p-2">
                              <div className="flex items-center justify-between px-2 py-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Users className="w-3 h-3 text-amber-500" />
                                  Students ({searchResults.students.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    handleNavClick('students');
                                  }}
                                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                                >
                                  Open Roster
                                </button>
                              </div>
                              <div className="space-y-1">
                                {searchResults.students.map((student) => (
                                  <div
                                    key={student.id}
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      handleNavClick('students');
                                    }}
                                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                        {student.full_name?.charAt(0) || student.email?.charAt(0).toUpperCase() || 'S'}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                          {student.full_name || 'Student Candidate'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate">
                                          {student.email}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                                      Manage Access
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Submissions & Marks List */}
                          {(searchFilterTab === 'all' || searchFilterTab === 'marks') && searchResults.submissions.length > 0 && (
                            <div className="p-2">
                              <div className="flex items-center justify-between px-2 py-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Award className="w-3 h-3 text-emerald-500" />
                                  Submissions & Marks ({searchResults.submissions.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    handleNavClick('marks');
                                  }}
                                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                                >
                                  View all in Marks
                                </button>
                              </div>
                              <div className="space-y-1">
                                {searchResults.submissions.map((sub) => {
                                  const testObj = tests.find((t) => t.id === sub.test_id);
                                  const isPass = (sub.percentage || 0) >= 50;
                                  return (
                                    <div
                                      key={sub.id}
                                      onClick={() => {
                                        setIsSearchOpen(false);
                                        setActiveReportSubmissionId(sub.id);
                                      }}
                                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                          {sub.user_name || sub.user_email || 'Student Candidate'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate">
                                          {sub.test_title || testObj?.title || 'Assessment'} &bull; Attempt #{sub.attempt_number || 1}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <span
                                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                            isPass
                                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                          }`}
                                        >
                                          {sub.percentage}%
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer Tip */}
                    <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Tip: Press <kbd className="px-1 py-0.2 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">ESC</kbd> to close</span>
                      <span>{searchResults.totalCount} total results</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Actions & User Profile Badge */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Theme Mode Toggle */}
              <ThemeToggle />

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

          {/* Page Title & Subtitle */}
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
              initialSearch={searchQuery}
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
              initialSearch={searchQuery}
              onSelectSubmission={(subId) => setActiveReportSubmissionId(subId)}
              onRetakeTest={(testId) => onStartTestPreview?.(testId)}
              onNavigateToTests={() => setActiveNav('tests')}
            />
          </div>
        ) : activeNav === 'students' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <UserManagementView initialTestId={manageUsersTestId} initialSearch={searchQuery} />
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
                        {searchQuery ? `Student Submissions (${overviewSubmissions.length})` : 'Student Submissions & Activity'}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {searchQuery ? `Matching "${searchQuery}"` : 'Latest candidate test completions and evaluation state'}
                      </p>
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
                    {overviewSubmissions.map((sub, idx) => {
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

                    {overviewSubmissions.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        {searchQuery ? `No submissions matched "${searchQuery}".` : 'No submissions recorded yet. Students can take tests from the catalog.'}
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

                {/* 2. Available Test Papers Catalog List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {searchQuery ? `Matching Papers (${overviewTests.length})` : 'Available Papers'}
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        {searchQuery ? `Filtered by "${searchQuery}"` : 'Registered examination tests'}
                      </p>
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
                    {overviewTests.map((test, idx) => {
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
                    {overviewTests.length === 0 && (
                      <div className="text-center py-4 text-xs text-slate-400">
                        {searchQuery ? `No test papers matched "${searchQuery}".` : 'No test papers registered yet.'}
                      </div>
                    )}
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
