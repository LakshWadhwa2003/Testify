import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/database';
import { Lock, Mail, User, Shield, GraduationCap, ArrowRight, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, signup } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoNotice(null);

    if (isRegister) {
      if (!fullName.trim()) {
        setError('Please provide your full name');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      setLoading(true);
      try {
        const res = await signup(email, password, fullName, role);
        if (!res.success) {
          if (res.requiresEmailConfirmation) {
            setInfoNotice(res.error || 'Account created! Please check your email to confirm your account before logging in.');
            setIsRegister(false); // Switch to Sign In tab
            setError(null);
          } else {
            setError(res.error || 'Failed to register account');
          }
        }
      } catch (err: any) {
        setError(err?.message || 'An error occurred during authentication');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter your email and password');
        return;
      }
      setLoading(true);
      try {
        const res = await login(email, password, role);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
        }
      } catch (err: any) {
        setError(err?.message || 'An error occurred during authentication');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      style={{
        backgroundImage: "url('/images/gradient-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle tint overlay */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Floating liquid glass orbs for visual depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div
          className="absolute top-[12%] left-[10%] w-36 h-36 rounded-full opacity-60 animate-pulse"
          style={{
            background: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            border: '2px solid rgba(255, 255, 255, 0.45)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
          }}
        />
        <div
          className="absolute bottom-[14%] right-[10%] w-32 h-32 rounded-full opacity-55 animate-pulse"
          style={{
            animationDelay: '1000ms',
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(22px) saturate(180%)',
            WebkitBackdropFilter: 'blur(22px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.45)',
          }}
        />
        <div
          className="absolute top-[28%] right-[18%] w-20 h-20 rounded-full opacity-45 animate-pulse"
          style={{
            animationDelay: '500ms',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(18px) saturate(180%)',
            WebkitBackdropFilter: 'blur(18px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          className="absolute bottom-[22%] left-[22%] w-24 h-24 rounded-full opacity-50 animate-pulse"
          style={{
            animationDelay: '750ms',
            background: 'rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          }}
        />
      </div>

      {/* Main Liquid Glass Card */}
      <div className="w-full max-w-md liquid-glass-card rounded-[32px] p-6 sm:p-8 relative z-10 transition-all duration-300">
        {/* Top ambient light line */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Top Right Close Button (if onClose provided) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-700 hover:text-slate-900 rounded-xl bg-white/20 hover:bg-white/40 border border-white/40 transition-colors touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-xl transition-transform hover:scale-105 duration-300"
            style={{
              background: 'linear-gradient(135deg, #0C115B 0%, #312E81 50%, #4F46E5 100%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 10px 25px rgba(12, 17, 91, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            }}
          >
            <GraduationCap className="w-7 h-7 text-white drop-shadow-sm" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-700/85 font-medium mt-1">
            {isRegister
              ? 'Register your student or teacher account to get started'
              : 'Sign in to your account to continue'}
          </p>
        </div>

        {/* Segmented Auth Mode Switch */}
        <div
          className="grid grid-cols-2 gap-1 p-1 rounded-2xl mb-6 shadow-xs"
          style={{
            background: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.45)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
              setInfoNotice(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 touch-manipulation active:scale-95 ${
              !isRegister
                ? 'bg-white/90 text-slate-900 shadow-md backdrop-blur-md border border-white/60'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/20'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
              setInfoNotice(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 touch-manipulation active:scale-95 ${
              isRegister
                ? 'bg-white/90 text-slate-900 shadow-md backdrop-blur-md border border-white/60'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/20'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Info Notification */}
        {infoNotice && (
          <div
            className="mb-4 p-3.5 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5 shadow-sm"
            style={{
              background: 'rgba(236, 253, 245, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
            }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Check Your Email</span>
              {infoNotice}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="mb-4 p-3.5 rounded-2xl text-xs text-rose-950 flex items-start gap-2.5 shadow-sm"
            style={{
              background: 'rgba(255, 241, 242, 0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(251, 113, 133, 0.5)',
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold block">Authentication Notice</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl liquid-glass-input text-slate-900 placeholder:text-slate-600/70 text-sm font-medium focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl liquid-glass-input text-slate-900 placeholder:text-slate-600/70 text-sm font-medium focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl liquid-glass-input text-slate-900 placeholder:text-slate-600/70 text-sm font-medium focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Role selector for registration */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-95 ${
                    role === 'student'
                      ? 'bg-white/95 text-indigo-950 shadow-md border-2 border-indigo-600/70 ring-2 ring-indigo-500/20'
                      : 'bg-white/20 text-slate-800 hover:bg-white/35 border border-white/50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-95 ${
                    role === 'admin'
                      ? 'bg-white/95 text-amber-950 shadow-md border-2 border-amber-600/70 ring-2 ring-amber-500/20'
                      : 'bg-white/20 text-slate-800 hover:bg-white/35 border border-white/50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  Admin (Teacher)
                </button>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 font-bold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: '#0C115B',
              color: 'white',
              boxShadow: '0 12px 28px rgba(12, 17, 91, 0.35)',
            }}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account & Access App' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
