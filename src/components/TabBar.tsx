import React from 'react';
import { BookOpen, Award, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type TabType = 'tests' | 'marks' | 'users' | 'profile';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();

  const tabs = [
    { id: 'tests' as TabType, label: isAdmin ? 'Papers' : 'Tests', icon: BookOpen },
    { id: 'marks' as TabType, label: isAdmin ? 'All Marks' : 'My Marks', icon: Award },
    ...(isAdmin ? [{ id: 'users' as TabType, label: 'Students', icon: Users }] : []),
    { id: 'profile' as TabType, label: 'Profile', icon: UserCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom,0px)] bg-white/92 dark:bg-slate-900/92 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 select-none">
      <div className="max-w-md mx-auto px-4 sm:px-6 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all active:scale-90 touch-manipulation ${isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full dark:bg-indigo-400" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
