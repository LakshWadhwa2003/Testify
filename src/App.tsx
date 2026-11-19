import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { TabBar, TabType } from './components/TabBar';
import { InstallPwaBanner } from './components/InstallPwaBanner';
import { TestsCatalogView } from './components/TestsCatalogView';
import { MarksView } from './components/MarksView';
import { ProfileView } from './components/ProfileView';
import { TestTakingView } from './components/TestTakingView';
import { TestReportView } from './components/TestReportView';
import { EditTestView } from './components/EditTestView';
import { AdminUploadPaper } from './components/AdminUploadPaper';
import { UserManagementView } from './components/UserManagementView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { testsService, userTestAccessService } from './services/api';
import { TestPaper, Question } from './types/database';

export function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('tests');
  const [manageUsersTestId, setManageUsersTestId] = useState<string | null>(null);

  // Active Test Taking State
  const [takingTestId, setTakingTestId] = useState<string | null>(null);
  const [activeTest, setActiveTest] = useState<{ test: TestPaper; questions: Question[] } | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  // Active Completed Submission Report Page
  const [activeReportSubmissionId, setActiveReportSubmissionId] = useState<string | null>(null);

  // Active Test Editing & Creation Pages
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Real-time synchronization for active previewed test
  useEffect(() => {
    const unsubscribe = testsService.subscribeToTests((event) => {
      if (activeTest && event.testId && activeTest.test.id === event.testId && !takingTestId) {
        testsService.getTestById(event.testId).then((data) => {
          if (data) setActiveTest(data);
        });
      }
    });
    return () => unsubscribe();
  }, [activeTest, takingTestId]);

  // Handle Tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveReportSubmissionId(null);
    setEditingTestId(null);
    setIsCreatingTest(false);
    if (tab !== 'users') {
      setManageUsersTestId(null);
    }
    setActiveTab(tab);
  };

  // Start taking a test
  const handleStartTest = async (testId: string) => {
    setActiveReportSubmissionId(null);
    setEditingTestId(null);
    setIsCreatingTest(false);
    setEditingTestId(null);

    // If student, check if test is active for their account
    if (!isAdmin && user) {
      const isAllowed = await userTestAccessService.isTestActiveForUser(user.id, testId, user.email);
      if (!isAllowed) {
        alert('This test is currently deactivated for your account. Please contact your instructor to request access.');
        return;
      }
    }

    setLoadingTest(true);
    try {
      const data = await testsService.getTestById(testId);
      if (data && data.questions.length > 0) {
        setActiveTest(data);
        setTakingTestId(testId);
      } else {
        alert('This test has no questions yet.');
      }
    } catch (err: any) {
      alert('Failed to load test: ' + err.message);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleTestComplete = (result: { submissionId: string }) => {
    setTakingTestId(null);
    setActiveTest(null);
    setActiveReportSubmissionId(result.submissionId);
    setActiveTab('marks');
  };

  // Login Gated Check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-slate-500">Loading Muskaan...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthModal />
    );
  }

  // Active test taking UI (fullscreen iOS test experience)
  if (takingTestId && activeTest) {
    return (
      <TestTakingView
        test={activeTest.test}
        questions={activeTest.questions}
        onComplete={handleTestComplete}
        onExit={() => {
          setTakingTestId(null);
          setActiveTest(null);
        }}
      />
    );
  }

  // Admin Console (Unified modern dashboard matching reference design)
  if (isAdmin) {
    return (
      <AdminDashboardView onStartTestPreview={handleStartTest} />
    );
  }

  // Active test report page (separate page view)
  if (activeReportSubmissionId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto">
          <TestReportView
            submissionId={activeReportSubmissionId}
            onBack={() => {
              setActiveReportSubmissionId(null);
              setActiveTab('marks');
            }}
            onRetake={(testId) => {
              setActiveReportSubmissionId(null);
              handleStartTest(testId);
            }}
            onNavigateToTests={() => {
              setActiveReportSubmissionId(null);
              setActiveTab('tests');
            }}
          />
        </main>
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  // Active test editing page (separate page view)
  if (editingTestId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto">
          <EditTestView
            testId={editingTestId}
            onBack={() => setEditingTestId(null)}
            onSaved={(_updatedTest) => {
              setEditingTestId(null);
              setActiveTab('tests');
            }}
          />
        </main>
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  // Active test creation page (separate page view)
  if (isCreatingTest && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto">
          <AdminUploadPaper
            onSuccess={() => {
              setIsCreatingTest(false);
              setActiveTab('tests');
            }}
            onCancel={() => setIsCreatingTest(false)}
          />
        </main>
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* iOS App Navigation Header */}
      <Navbar />

      {/* iOS Add to Home Screen PWA Tip */}
      <InstallPwaBanner />

      {/* Global Test Loading Indicator */}
      {loadingTest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center">
          <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-semibold text-white bg-slate-900/80 px-3.5 py-1.5 rounded-full shadow-lg">
            Preparing Assessment...
          </span>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {activeTab === 'tests' && (
          <TestsCatalogView
            onStartTest={handleStartTest}
            onEditTest={(testId) => setEditingTestId(testId)}
            onCreateTest={() => setIsCreatingTest(true)}
            onViewReports={() => setActiveTab('marks')}
            onManageUsers={(testId) => {
              setManageUsersTestId(testId || null);
              setActiveTab('users');
            }}
          />
        )}

        {activeTab === 'marks' && (
          <MarksView
            onSelectSubmission={(submissionId) => setActiveReportSubmissionId(submissionId)}
            onRetakeTest={(testId) => handleStartTest(testId)}
            onNavigateToTests={() => setActiveTab('tests')}
          />
        )}

        {activeTab === 'users' && isAdmin && (
          <UserManagementView initialTestId={manageUsersTestId} />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* iOS Bottom Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}
