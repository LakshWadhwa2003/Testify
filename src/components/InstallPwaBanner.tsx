import React, { useState } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const dismissed = localStorage.getItem('muskaan_dismiss_pwa_banner');
    return Boolean(isIos && !isStandalone && !dismissed);
  });

  if (!show) return null;

  return (
    <div className="mx-3 sm:mx-4 mt-2 sm:mt-3 mb-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative">
      <button
        type="button"
        onClick={() => {
          localStorage.setItem('muskaan_dismiss_pwa_banner', 'true');
          setShow(false);
        }}
        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
        aria-label="Dismiss banner"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-5">
        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 shrink-0">
          <Share className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">Install as iOS App</h4>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Tap the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Share</span> icon in Safari, then select <span className="font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-0.5"><PlusSquare className="w-3 h-3 inline" /> Add to Home Screen</span> for the native app experience.
          </p>
        </div>
      </div>
    </div>
  );
};
