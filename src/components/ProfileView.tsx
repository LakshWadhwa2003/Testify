import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Smartphone, CheckCircle, Database } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, isAdmin, logout, isConfigured, switchMockRole } = useAuth();

  return (
    <div className="max-w-md mx-auto px-3.5 sm:px-4 py-4 sm:py-6 pb-28">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg shadow-indigo-500/20">
          {user?.full_name?.charAt(0) || user?.email.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {user?.full_name || 'Student Account'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {isAdmin ? 'Admin (Teacher)' : 'Student'}
        </span>
      </div>

      {/* Account Details iOS Grouped Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          System & Device Status
        </h3>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-400" />
            PWA Platform
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            iOS / Web Progressive App
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            Backend Database
          </span>
          <span className={`font-semibold ${isConfigured ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'}`}>
            {isConfigured ? 'Connected' : 'Local Sandbox'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-400" />
            Offline Mode
          </span>
          <span className="font-semibold text-emerald-600">Enabled (Service Worker)</span>
        </div>
      </div>

      {/* Quick Demo Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Quick Switch Account
        </h3>
        <p className="text-xs text-slate-500">
          Easily test the app experience between Instructor (Admin) and Student.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => switchMockRole('admin')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all touch-manipulation active:scale-95 ${isAdmin
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
          >
            Admin (Teacher)
          </button>
          <button
            type="button"
            onClick={() => switchMockRole('student')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all touch-manipulation active:scale-95 ${!isAdmin
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
          >
            Student Account
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => logout()}
          className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 touch-manipulation active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
