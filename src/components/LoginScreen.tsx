import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ShieldAlert, Key, CheckCircle2, ArrowLeft } from 'lucide-react';
import {
  getStoredPassword,
  verifyPasswordOrMasterCode,
  resetPasswordWithMasterCode,
  MASTER_BACKUP_CODE,
} from '../utils/storage';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot / Reset Password state
  const [isResetMode, setIsResetMode] = useState(false);
  const [masterCode, setMasterCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (verifyPasswordOrMasterCode(password)) {
        onLoginSuccess();
      } else {
        setError('Incorrect password. Please try again or use your master security backup code.');
      }
      setIsLoading(false);
    }, 200);
  };

  const handleResetWithMasterCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (masterCode.trim() !== MASTER_BACKUP_CODE) {
      setError('Invalid master backup code! Please check your private security code.');
      return;
    }

    if (newPassword.length < 3) {
      setError('New password must be at least 3 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    const success = resetPasswordWithMasterCode(masterCode.trim(), newPassword);
    if (success) {
      setResetSuccessMsg('Password reset successfully! You can now sign in with your new password.');
      setPassword(newPassword);
      setTimeout(() => {
        setIsResetMode(false);
        setResetSuccessMsg('');
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-600">
            T&D Inspection
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Management Hub
          </p>
        </div>

        {!isResetMode ? (
          /* Normal Sign In Form */
          <form onSubmit={handleSubmitLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                System Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter password..."
                  autoFocus
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              {isLoading ? 'Authenticating...' : 'Sign In to System'}
            </button>

            {/* Forgot Password / Master Code Prompt */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setError('');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Forgot password? Reset with Master Security Code
              </button>
            </div>
          </form>
        ) : (
          /* Reset with Master Security Code Form */
          <form onSubmit={handleResetWithMasterCode} className="space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError('');
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Master Password Recovery</h3>
                <p className="text-[11px] text-slate-400">Enter your private security code to reset</p>
              </div>
            </div>

            {resetSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {resetSuccessMsg}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Master Security Backup Code
              </label>
              <input
                type="password"
                required
                value={masterCode}
                onChange={(e) => {
                  setMasterCode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter private master code..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm font-mono transition outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition outline-hidden"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError('');
                }}
                className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}

        {/* Security & Hint Notice */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              Default password: <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold text-xs">admin</code>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            (You can update your password or use your master backup code anytime)
          </p>
        </div>
      </div>
    </div>
  );
};
