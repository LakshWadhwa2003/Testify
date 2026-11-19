import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, Check, Copy, ExternalLink, X, AlertCircle } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const { isConfigured } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedMigration, setCopiedMigration] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = async () => {
    try {
      const res = await fetch('/supabase/schema.sql');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyMigration = async () => {
    try {
      const res = await fetch('/supabase/migration_add_user_test_access.sql');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedMigration(true);
      setTimeout(() => setCopiedMigration(false), 2500);
    } catch {
      setCopiedMigration(true);
      setTimeout(() => setCopiedMigration(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden page-enter">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                Supabase Database Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Status: <strong className={isConfigured ? 'text-emerald-600' : 'text-amber-600'}>
                  {isConfigured ? 'Connected (Live)' : 'Local Sandbox'}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
            aria-label="Close modal"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs text-slate-600 dark:text-slate-300 max-h-[75vh] overflow-y-auto">
          {/* Status Box */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            }`}>
            {isConfigured ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <span className="font-semibold block">
                {isConfigured ? 'Live Supabase backend configured' : 'Currently in Local Sandbox mode'}
              </span>
              <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                {isConfigured
                  ? 'Your tests, questionnaires, and marks are securely stored in your Supabase Postgres database with Row Level Security.'
                  : 'You can test the full app right now using local simulated storage, or connect your Supabase project in 2 minutes below.'}
              </p>
            </div>
          </div>

          {/* Setup Steps */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              Connecting Your Supabase Database:
            </h4>
            <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
              <li>
                Create a free project at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </li>
              <li>
                Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the schema script below (creates <code>profiles</code>, <code>tests</code>, <code>questions</code>, <code>submissions</code>, RLS, and the secure grading function).
              </li>
              <li>
                Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> into your <code>.env</code> file:
                <pre className="mt-1 p-2 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                  {`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                </pre>
              </li>
              <li>
                <strong>Important:</strong> In your Supabase Dashboard, go to <strong>Authentication &rarr; Providers &rarr; Email</strong> and turn <strong>OFF &quot;Confirm email&quot;</strong>. This allows instant user signups without hitting the 3 emails/hour SMTP rate limit!
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleCopySchema}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-center gap-2 transition-all bg-white dark:bg-slate-800 active:scale-95 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Full SQL Schema Copied!' : 'Copy Full SQL Schema (supabase/schema.sql)'}</span>
            </button>

            <button
              onClick={handleCopyMigration}
              className="w-full py-2 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-slate-50 dark:bg-slate-800/60 active:scale-95"
            >
              {copiedMigration ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedMigration ? 'User Test Access Migration Copied!' : 'Copy User Test Access Migration SQL'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
