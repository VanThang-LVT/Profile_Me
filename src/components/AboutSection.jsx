import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, Github, Linkedin, Facebook, Download, Sparkles, Code2, Award, Heart } from 'lucide-react';

export const AboutSection = ({ profile, transcriptData, onNavigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-8 md:p-12 shadow-xl border border-slate-200/80 dark:border-slate-700">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Image */}
          <div className="shrink-0">
            <img
              src={profile.avatar || "/avatar.png"}
              alt={profile.fullName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
              }}
              className="w-48 aspect-[3/4] md:w-56 lg:w-60 rounded-2xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-md"
            />
          </div>

          {/* Hero Main Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-semibold tracking-wide border border-blue-200 dark:border-blue-800 mb-3">
                 Sẵn sàng đón nhận cơ hội việc làm
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {profile.fullName}
              </h1>
              <p className="text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {profile.title}
              </p>
            </div>

            {/* Sub-info Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-600">
                <GraduationCap size={16} className="text-blue-500" />
                <span>{profile.university}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-600">
                <MapPin size={16} className="text-rose-500" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-600">
                <Award size={16} className="text-amber-500" />
                {transcriptData && transcriptData.totalCredits > 0 ? (
                  <span>GPA: <strong className="text-slate-900 dark:text-white">{transcriptData.overallGpa4}/4.0</strong> ({transcriptData.classification})</span>
                ) : (
                  <span>Bảng điểm: <strong className="text-slate-900 dark:text-white">Chờ Upload Excel</strong></span>
                )}
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('resume')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
              >
                <Download size={18} />
                <span>Xem CV (PDF)</span>
              </button>
              <button
                onClick={() => onNavigate('transcript')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-600 transition-all"
              >
                <Award size={18} className="text-amber-500" />
                <span>Tra cứu Bảng điểm</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-600 transition-all"
              >
                <Mail size={18} className="text-emerald-500" />
                <span>Liên hệ ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section: Bio & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bio Card (2 Cols) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Code2 size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Giới thiệu bản thân
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            {profile.bio}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">Chuyên ngành</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.major}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">Mã sinh viên</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.studentId || 'Chưa cập nhật'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">Trạng thái</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                ● Sẵn sàng thực tập/Đi làm
              </span>
            </div>
          </div>
        </div>

        {/* Social & Contact Card (1 Col) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Kênh liên lạc
            </h3>
            <div className="space-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail size={18} className="text-blue-500" />
                <span className="text-sm font-medium truncate">{profile.email}</span>
              </a>
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Phone size={18} className="text-emerald-500" />
                <span className="text-sm font-medium">{profile.phone}</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 mb-3">Mạng xã hội & Code</span>
            <div className="flex items-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-900 hover:text-white transition-all"
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={profile.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-blue-500 hover:bg-blue-700 hover:text-white transition-all"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Code2 size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kỹ năng công nghệ & Năng lực
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {profile.skills.map((skill, index) => (
            <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>{skill.name}</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span className="inline-block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interests & Hobbies */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
            <Heart size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sở thích & Định hướng
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-600"
            >
              ✨ {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
