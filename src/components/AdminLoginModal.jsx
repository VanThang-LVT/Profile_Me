import React, { useState } from 'react';
import { Shield, KeyRound, X, AlertCircle, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { loginAdmin, resetAdminPassword } from '../utils/auth';

export const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    const result = loginAdmin(password);
    if (result.success) {
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleResetPassword = () => {
    resetAdminPassword();
    setPassword('admin123');
    setErrorMsg('');
    setInfoMsg('Đã đặt lại mật khẩu về "admin123". Vui lòng nhấn Đăng nhập!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-700/50 shadow-inner">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Đăng nhập Quản trị
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nhập mật khẩu để mở quyền cập nhật CV (PDF) & Bảng điểm (Excel)
          </p>
        </div>

        {/* Info Alert */}
        {infoMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            {infoMsg}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={handleResetPassword}
              className="self-end inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 underline font-bold"
            >
              <RotateCcw size={12} />
              <span>Đặt lại về admin123</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Mật khẩu Quản trị
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 italic pt-1">
              <span>Mật khẩu mặc định: <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">admin123</code></span>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-amber-600 dark:text-amber-400 hover:underline not-italic font-semibold"
              >
                Đặt lại mặc định
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all"
          >
            Đăng nhập Quản trị viên
          </button>
        </form>
      </div>
    </div>
  );
};
