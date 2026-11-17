import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, User, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full pt-[env(safe-area-inset-top,0px)] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-all">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
              <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">T</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Testify
              </h1>
              <span
                className={`inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ring-1 ${
                  isAdmin
                    ? 'bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/50'
                    : 'bg-indigo-50 text-indigo-700 ring-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-800/50'
                }`}
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Admin</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                    <span>Student</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-tight truncate">
              Assessments & Quizzes
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
                {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px] leading-tight">
                  {user.full_name || user.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-400 capitalize leading-tight">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => logout()}
            className="group relative flex items-center justify-center min-w-[36px] min-h-[36px] p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 transition-all duration-150 active:scale-95 touch-manipulation"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
