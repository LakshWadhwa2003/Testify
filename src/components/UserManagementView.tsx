import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Profile, TestPaper, Submission, UserTestAccess } from '../types/database';
import { usersService, testsService, submissionsService, userTestAccessService, isDemoStudentOrAccount } from '../services/api';
import {
  Users,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  UserPlus,
  Clock,
  Award,
  BookOpen,
  Check,
  CheckCheck,
  Ban,
  GraduationCap,
  X,
  BarChart3,
  KeyRound,
  ChevronLeft,
  Trash2
} from 'lucide-react';

interface UserManagementViewProps {
  initialTestId?: string | null;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ initialTestId }) => {
  // Data state
  const [users, setUsers] = useState<Profile[]>([]);
  const [tests, setTests] = useState<TestPaper[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [accessList, setAccessList] = useState<UserTestAccess[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: 'by-user' or 'by-test'
  const [activeMode, setActiveMode] = useState<'by-user' | 'by-test'>('by-user');
  const [mobileView, setMobileView] = useState<'roster' | 'detail'>(initialTestId ? 'detail' : 'roster');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(initialTestId || null);

  // Filters & Search (admins are off the list, searching students only)
  const [userSearch, setUserSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');
  const [testCategoryFilter, setTestCategoryFilter] = useState('All');
  const [testStatusFilter, setTestStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  // Deactivated by default
  const [activateAllForNew, setActivateAllForNew] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Load all data
  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [usersData, testsData, subsData, accessData] = await Promise.all([
        usersService.getUsers(),
        testsService.getTests(true),
        submissionsService.getSubmissions(),
        userTestAccessService.getAllAccess(),
      ]);

      setUsers(usersData);
      setTests(testsData);
      setSubmissions(subsData);
      setAccessList(accessData);

      // Default select first student (admins and demo accounts are excluded)
      const studentUsers = usersData.filter((u) => u.role === 'student' && !isDemoStudentOrAccount(u));
      if (!selectedUserId || !studentUsers.some((u) => u.id === selectedUserId)) {
        setSelectedUserId(studentUsers.length > 0 ? studentUsers[0].id : null);
      }

      if (!selectedTestId && testsData.length > 0) {
        setSelectedTestId(testsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load user management data:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [selectedUserId, selectedTestId]);

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

  // ONLY STUDENTS: All admins and demo accounts are off the list!
  const students = useMemo(() => {
    return users.filter((u) => u.role === 'student' && !isDemoStudentOrAccount(u));
  }, [users]);

  // Map access fast lookup: `userId_testId` -> boolean
  const accessMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const item of accessList) {
      map.set(`${item.user_id}_${item.test_id}`, item.is_active);
    }
    return map;
  }, [accessList]);

  // Submissions grouped by user
  const subsByUser = useMemo(() => {
    const map = new Map<string, Submission[]>();
    for (const sub of submissions) {
      const list = map.get(sub.user_id) || [];
      list.push(sub);
      map.set(sub.user_id, list);
    }
    return map;
  }, [submissions]);

  // Submissions grouped by (user, test)
  const subsByUserAndTest = useMemo(() => {
    const map = new Map<string, Submission[]>();
    for (const sub of submissions) {
      const key = `${sub.user_id}_${sub.test_id}`;
      const list = map.get(key) || [];
      list.push(sub);
      map.set(key, list);
    }
    return map;
  }, [submissions]);

  // Helper: check if a test is active for a student.
  // CRITICAL REQUIREMENT: By default, all students have all tests DEACTIVATED (false)!
  const isTestActive = useCallback((userId: string, testId: string): boolean => {
    const key = `${userId}_${testId}`;
    if (accessMap.has(key)) {
      return accessMap.get(key) === true;
    }
    // Deactivated by default
    return false;
  }, [accessMap]);

  // Toggle active state for single student & test
  const handleToggleTestAccess = async (userId: string, testId: string) => {
    const currentStatus = isTestActive(userId, testId);
    const newStatus = !currentStatus;

    // Optimistic UI update
    setAccessList((prev) => {
      const filtered = prev.filter((a) => !(a.user_id === userId && a.test_id === testId));
      return [
        ...filtered,
        {
          id: 'temp-' + Date.now(),
          user_id: userId,
          test_id: testId,
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        },
      ];
    });

    try {
      const student = students.find((u) => u.id === userId);
      await userTestAccessService.setUserTestAccess(userId, testId, newStatus, student?.email);
      const test = tests.find((t) => t.id === testId);
      showToast(
        newStatus
          ? `Activated "${test?.title?.slice(0, 24)}..." for ${student?.full_name || 'student'}`
          : `Deactivated "${test?.title?.slice(0, 24)}..." for ${student?.full_name || 'student'}`
      );
    } catch (err) {
      console.error('Failed to toggle test access:', err);
      showToast('Error updating test access.');
      loadData();
    }
  };

  // Bulk activate/deactivate for a student
  const handleBulkUserAccess = async (userId: string, makeActive: boolean) => {
    const testIds = tests.map((t) => t.id);
    const student = students.find((u) => u.id === userId);

    // Optimistic UI update
    setAccessList((prev) => {
      const filtered = prev.filter((a) => a.user_id !== userId);
      const newItems: UserTestAccess[] = testIds.map((tid) => ({
        id: 'bulk-' + tid + '-' + Date.now(),
        user_id: userId,
        user_email: student?.email,
        test_id: tid,
        is_active: makeActive,
        updated_at: new Date().toISOString(),
      }));
      return [...filtered, ...newItems];
    });

    try {
      await userTestAccessService.setBulkUserTestAccess(userId, testIds, makeActive, student?.email);
      showToast(
        makeActive
          ? `All tests activated for ${student?.full_name || 'student'}`
          : `All tests deactivated for ${student?.full_name || 'student'}`
      );
    } catch (err) {
      console.error('Failed to update bulk access:', err);
      showToast('Error updating all tests.');
      loadData();
    }
  };

  // Bulk activate/deactivate for a test across all students
  const handleBulkTestAccess = async (testId: string, makeActive: boolean) => {
    const studentList = students.map((u) => ({ id: u.id, email: u.email }));
    const studentIds = studentList.map((u) => u.id);

    // Optimistic UI update
    setAccessList((prev) => {
      const filtered = prev.filter((a) => a.test_id !== testId || !studentIds.includes(a.user_id));
      const newItems: UserTestAccess[] = studentList.map((st) => ({
        id: 'bulk-test-' + st.id + '-' + Date.now(),
        user_id: st.id,
        user_email: st.email,
        test_id: testId,
        is_active: makeActive,
        updated_at: new Date().toISOString(),
      }));
      return [...filtered, ...newItems];
    });

    try {
      await userTestAccessService.setBulkTestUsersAccess(testId, studentList, makeActive);
      const test = tests.find((t) => t.id === testId);
      showToast(
        makeActive
          ? `Activated "${test?.title?.slice(0, 24)}..." for all students`
          : `Deactivated "${test?.title?.slice(0, 24)}..." for all students`
      );
    } catch (err) {
      console.error('Failed to update bulk test access:', err);
      showToast('Error updating students for test.');
      loadData();
    }
  };

  // Create new student
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) {
      alert('Please provide both name and email.');
      return;
    }

    setSavingUser(true);
    try {
      const created = await usersService.createUser({
        email: newUserEmail.trim(),
        full_name: newUserName.trim(),
        role: 'student', // Confined strictly to students
      });

      if (activateAllForNew && tests.length > 0) {
        await userTestAccessService.setBulkUserTestAccess(
          created.id,
          tests.map((t) => t.id),
          true,
          created.email
        );
      }

      setUsers((prev) => [created, ...prev]);
      setSelectedUserId(created.id);
      setIsAddModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setActivateAllForNew(false);
      showToast(`Added student ${created.full_name} (Tests deactivated by default)`);
    } catch (err: any) {
      alert('Failed to add student: ' + (err.message || err));
    } finally {
      setSavingUser(false);
    }
  };

  // Delete student from roster
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${studentName}" from the student roster? This will also remove their test access allocations and submissions.`)) {
      return;
    }
    setDeletingStudentId(studentId);
    try {
      await usersService.deleteUser(studentId);
      showToast(`Removed "${studentName}" from roster`);
      if (selectedUserId === studentId) {
        setSelectedUserId(null);
        setMobileView('roster');
      }
      await loadData(false);
    } catch (err: any) {
      console.error('Failed to remove student:', err);
      showToast('Error removing student');
    } finally {
      setDeletingStudentId(null);
    }
  };

  // Filtered students (only students, searched by name or email)
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        (s.full_name && s.full_name.toLowerCase().includes(userSearch.toLowerCase())) ||
        s.email.toLowerCase().includes(userSearch.toLowerCase());
      return matchesSearch;
    });
  }, [students, userSearch]);

  // Selected student object
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedUserId) || null;
  }, [students, selectedUserId]);

  // Filtered tests for selected student
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(tests.map((t) => t.category || 'General')))];
  }, [tests]);

  const filteredTestsForUser = useMemo(() => {
    if (!selectedUserId) return [];
    return tests.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(testSearch.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(testSearch.toLowerCase()));
      const matchesCat = testCategoryFilter === 'All' || t.category === testCategoryFilter;
      const active = isTestActive(selectedUserId, t.id);
      const matchesStatus =
        testStatusFilter === 'all' ||
        (testStatusFilter === 'active' && active) ||
        (testStatusFilter === 'inactive' && !active);
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [tests, selectedUserId, testSearch, testCategoryFilter, testStatusFilter, isTestActive]);

  // Selected test object for 'by-test' mode
  const selectedTest = useMemo(() => {
    return tests.find((t) => t.id === selectedTestId) || null;
  }, [tests, selectedTestId]);

  // Total active allocations across all students
  const totalActiveAllocations = useMemo(() => {
    let count = 0;
    for (const student of students) {
      for (const test of tests) {
        if (isTestActive(student.id, test.id)) {
          count++;
        }
      }
    }
    return count;
  }, [students, tests, isTestActive]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-slate-500">Loading Student Access Management...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-slate-700 dark:border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Student Access Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Admin Tool
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control which tests are active or locked for each student. By default, all tests are deactivated until activated by an instructor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => {
                setActiveMode('by-user');
                setMobileView('roster');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all touch-manipulation active:scale-95 ${activeMode === 'by-user'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              By Student
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('by-test');
                setMobileView('roster');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all touch-manipulation active:scale-95 ${activeMode === 'by-test'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              By Test Paper
            </button>
          </div>

          {/* Add Student Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Student</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Admins are off the list, focused purely on student access */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{students.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Learners on platform</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Allocations</span>
            <KeyRound className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{totalActiveAllocations}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Activated test permissions</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Test Papers</span>
            <BookOpen className="w-4 h-4 text-violet-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{tests.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Assessments available</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Submissions</span>
            <BarChart3 className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{submissions.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Student attempts</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: BY STUDENT VIEW (All admins off the list)                    */}
      {/* ==================================================================== */}
      {activeMode === 'by-user' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Student Roster */}
          <div className={`${mobileView === 'detail' ? 'hidden lg:flex' : 'flex'} lg:col-span-5 flex-col space-y-3`}>
            {/* Student Search */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-base sm:text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 text-center border border-slate-200/80 dark:border-slate-800">
                  <p className="text-xs text-slate-400">No students found matching your search.</p>
                </div>
              ) : (
                filteredStudents.map((s) => {
                  const isSelected = selectedUserId === s.id;
                  const studentSubs = subsByUser.get(s.id) || [];
                  const activeCount = tests.filter((t) => isTestActive(s.id, t.id)).length;
                  const totalCount = tests.length;
                  const percentActive = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedUserId(s.id);
                        setMobileView('detail');
                      }}
                      className={`p-3.5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 touch-manipulation active:scale-[0.99] ${isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                          {s.full_name?.charAt(0) || s.email.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block">
                            {s.full_name || s.email}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">{s.email}</span>

                          {/* Tests active badge (Deactivated by default indicator) */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${percentActive === 100
                                  ? 'bg-emerald-500'
                                  : percentActive > 0
                                    ? 'bg-indigo-500'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                  }`}
                                style={{ width: `${percentActive}%` }}
                              />
                            </div>
                            <span
                              className={`text-[10px] font-medium ${activeCount === 0
                                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                : 'text-slate-500'
                                }`}
                            >
                              {activeCount === 0 ? 'All Deactivated (0)' : `${activeCount}/${totalCount} active`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {studentSubs.length} {studentSubs.length === 1 ? 'attempt' : 'attempts'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(s.id, s.full_name || s.email);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title={`Remove ${s.full_name || s.email}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Test Access Control Panel for Selected Student */}
          <div className={`${mobileView === 'roster' ? 'hidden lg:flex' : 'flex'} lg:col-span-7 flex-col space-y-4`}>
            {selectedStudent ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  onClick={() => setMobileView('roster')}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 self-start mb-3 active:scale-95 transition-all touch-manipulation"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>All Students</span>
                </button>

                {/* Student Info & Quick Actions Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-indigo-500/20 shrink-0">
                      {selectedStudent.full_name?.charAt(0) || selectedStudent.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {selectedStudent.full_name || 'Selected Student'}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                          Student
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                    </div>
                  </div>

                  {/* Bulk Actions & Removal */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBulkUserAccess(selectedStudent.id, true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors active:scale-95 touch-manipulation"
                      title="Activate all test papers for this student"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Activate All</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkUserAccess(selectedStudent.id, false)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition-colors active:scale-95 touch-manipulation"
                      title="Deactivate all test papers for this student (Default state)"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Deactivate All</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(selectedStudent.id, selectedStudent.full_name || selectedStudent.email)}
                      disabled={deletingStudentId === selectedStudent.id}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 text-xs font-semibold transition-colors active:scale-95 touch-manipulation disabled:opacity-50"
                      title="Remove student from roster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingStudentId === selectedStudent.id ? 'Removing...' : 'Remove'}</span>
                    </button>
                  </div>
                </div>

                {/* Default Notice Banner */}
                <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                    Tests are <strong>deactivated by default</strong> for students. Toggle on the papers you wish this student to take.
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 shrink-0 ml-2">
                    {tests.filter((t) => isTestActive(selectedStudent.id, t.id)).length} of {tests.length} Active
                  </span>
                </div>

                {/* Test Filters */}
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter test papers..."
                      value={testSearch}
                      onChange={(e) => setTestSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Category Filter */}
                    <select
                      value={testCategoryFilter}
                      onChange={(e) => setTestCategoryFilter(e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {/* Status Filter */}
                    <select
                      value={testStatusFilter}
                      onChange={(e) => setTestStatusFilter(e.target.value as any)}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                </div>

                {/* Tests List with Active Toggles */}
                <div className="space-y-3 mt-1 max-h-[500px] overflow-y-auto pr-1">
                  {filteredTestsForUser.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        No test papers match your criteria.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Try clearing filters or search terms.
                      </p>
                    </div>
                  ) : (
                    filteredTestsForUser.map((t) => {
                      const active = isTestActive(selectedStudent.id, t.id);
                      const key = `${selectedStudent.id}_${t.id}`;
                      const userAttempts = subsByUserAndTest.get(key) || [];
                      const hasAttempts = userAttempts.length > 0;
                      const bestScore = hasAttempts
                        ? Math.max(...userAttempts.map((a) => a.percentage))
                        : 0;

                      return (
                        <div
                          key={t.id}
                          className={`p-4 rounded-2xl border transition-all ${active
                            ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-900/60 shadow-xs'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 opacity-85'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                  {t.category || 'General'}
                                </span>
                                {!t.is_published && (
                                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                                    Draft
                                  </span>
                                )}
                              </div>

                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                {t.title}
                              </h4>

                              {t.description && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {t.description}
                                </p>
                              )}

                              {/* Test metadata & Student progress */}
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {t.duration_minutes}m
                                </span>
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3" />
                                  {t.total_points} Pts
                                </span>
                                {t.question_count !== undefined && (
                                  <span>{t.question_count} Questions</span>
                                )}

                                {hasAttempts ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    {userAttempts.length} attempts (Best {bestScore}%</span>
                                ) : (
                                  <span className="text-slate-400">No attempts yet</span>
                                )}
                              </div>
                            </div>

                            {/* Active Toggle Switch */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleTestAccess(selectedStudent.id, t.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl font-semibold text-xs transition-all active:scale-95 shadow-xs ${active
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                                  }`}
                                title={active ? 'Click to deactivate for this student' : 'Click to activate for this student'}
                              >
                                {active ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Inactive</span>
                                  </>
                                )}
                              </button>
                              <span className="text-[10px] text-slate-400">
                                {active ? 'Accessible to student' : 'Locked by default'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Student Selected</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select a student from the left column to view and configure their test permissions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: BY TEST VIEW (All admins off the list)                       */}
      {/* ==================================================================== */}
      {activeMode === 'by-test' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Test Selector */}
          <div className={`${mobileView === 'detail' ? 'hidden lg:flex' : 'flex'} lg:col-span-5 flex-col space-y-3`}>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search test papers..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-base sm:text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {tests
                .filter(
                  (t) =>
                    t.title.toLowerCase().includes(testSearch.toLowerCase()) ||
                    (t.description && t.description.toLowerCase().includes(testSearch.toLowerCase()))
                )
                .map((t) => {
                  const isSelected = selectedTestId === t.id;
                  const activeStudentCount = students.filter((s) => isTestActive(s.id, t.id)).length;
                  const totalStudents = students.length;

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTestId(t.id);
                        setMobileView('detail');
                      }}
                      className={`p-3.5 rounded-3xl border transition-all cursor-pointer touch-manipulation active:scale-[0.99] ${isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {t.category || 'General'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {activeStudentCount}/{totalStudents} students
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        <span>{t.duration_minutes}m</span>
                        <span>{t.total_points} Pts</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right Column: Students Access List for Selected Test */}
          <div className={`${mobileView === 'roster' ? 'hidden lg:flex' : 'flex'} lg:col-span-7 flex-col space-y-4`}>
            {selectedTest ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  onClick={() => setMobileView('roster')}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 self-start mb-3 active:scale-95 transition-all touch-manipulation"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>All Test Papers</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {selectedTest.category || 'General'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {selectedTest.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedTest.duration_minutes}m • {selectedTest.total_points} Pts •{' '}
                      {selectedTest.question_count || 0} Questions
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBulkTestAccess(selectedTest.id, true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors active:scale-95 touch-manipulation"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Activate All</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkTestAccess(selectedTest.id, false)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition-colors active:scale-95 touch-manipulation"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Deactivate All</span>
                    </button>
                  </div>
                </div>

                {/* List of students with access toggle (Only students, no admins) */}
                <div className="space-y-2.5 mt-4 max-h-[500px] overflow-y-auto pr-1">
                  {students.map((student) => {
                    const active = isTestActive(student.id, selectedTest.id);
                    const key = `${student.id}_${selectedTest.id}`;
                    const studentAttempts = subsByUserAndTest.get(key) || [];
                    const hasAttempts = studentAttempts.length > 0;
                    const bestScore = hasAttempts
                      ? Math.max(...studentAttempts.map((a) => a.percentage))
                      : 0;

                    return (
                      <div
                        key={student.id}
                        className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {student.full_name?.charAt(0) || student.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block">
                              {student.full_name || student.email}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {student.email}
                            </span>
                            {hasAttempts && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                {studentAttempts.length} attempts • Best {bestScore}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleTestAccess(student.id, selectedTest.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-xs ${active
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                              }`}
                          >
                            {active ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Test Selected</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select a test paper from the left column to view and toggle student access.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD STUDENT MODAL (Strictly students, deactivated by default)        */}
      {/* ==================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Student</h3>
                <p className="text-xs text-slate-400">Enroll a student. All tests are deactivated by default.</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Sengupta"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. diya@muskaan.edu"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activateAll"
                  checked={activateAllForNew}
                  onChange={(e) => setActivateAllForNew(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <label htmlFor="activateAll" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  Activate all existing test papers (Leave unchecked to keep all tests deactivated by default)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all"
                >
                  {savingUser ? 'Enrolling...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
