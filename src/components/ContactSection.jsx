import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Facebook, Send } from 'lucide-react';

export const ContactSection = ({ profile }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
          <Mail size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Thông tin Liên hệ & Hợp tác
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Các kênh liên lạc trực tiếp để trao đổi cơ hội tuyển dụng và làm việc
          </p>
        </div>
      </div>

      {/* Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Email Card */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all space-y-4 text-center flex flex-col items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <Mail size={28} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hộp thư Email</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {profile.email}
            </h3>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all w-full justify-center"
          >
            <Send size={15} />
            <span>Gửi Email Trực Tiếp</span>
          </a>
        </div>

        {/* Phone Card */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all space-y-4 text-center flex flex-col items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Phone size={28} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Số điện thoại / Zalo</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {profile.phone}
            </h3>
          </div>
          <a
            href={`tel:${profile.phone}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all w-full justify-center"
          >
            <Phone size={15} />
            <span>Gọi Ngay</span>
          </a>
        </div>

        {/* Location Card */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all space-y-4 text-center flex flex-col items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800">
            <MapPin size={28} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Địa chỉ làm việc</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {profile.location}
            </h3>
          </div>
          <div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs text-center border border-slate-200 dark:border-slate-600">
            Sẵn sàng làm việc tại TP.HCM & Hybrid
          </div>
        </div>

      </div>

      {/* Social Networks Banner */}
      <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white text-center">
          Mạng Xã Hội & Mã Nguồn
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm"
          >
            <Github size={18} />
            <span>GitHub Profile</span>
          </a>
          <a
            href={profile.facebook}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-all shadow-sm"
          >
            <Facebook size={18} />
            <span>Facebook Trực Tiếp</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-700 text-white font-semibold text-xs hover:bg-sky-600 transition-all shadow-sm"
          >
            <Linkedin size={18} />
            <span>LinkedIn Network</span>
          </a>
        </div>
      </div>
    </div>
  );
};
