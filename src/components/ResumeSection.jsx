import React from 'react';
import { 
  FileText, Download, 
  Briefcase, GraduationCap, Calendar, Award 
} from 'lucide-react';
import { experienceTimeline } from '../data/defaultData';
import { PdfCanvasViewer } from './PdfCanvasViewer';

export const ResumeSection = ({ cvMeta }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sơ yếu lý lịch (CV)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {cvMeta 
                ? `File PDF đính kèm: ${cvMeta.name} (Cập nhật: ${new Date(cvMeta.updatedAt).toLocaleDateString('vi-VN')})`
                : 'Bản xem trực tiếp web CV & PDF'}
            </p>
          </div>
        </div>

        {cvMeta && (
          <div className="flex items-center gap-3">
            <a
              href={cvMeta.dataUrl}
              download={cvMeta.name || "CV.pdf"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20 transition-all text-xs"
            >
              <Download size={16} />
              <span>Tải file PDF gốc</span>
            </a>
          </div>
        )}
      </div>

      {/* Main Content: Custom Canvas-based PDF Viewer */}
      {cvMeta ? (
        <div className="space-y-4">
          <PdfCanvasViewer dataUrl={cvMeta.dataUrl} fileName={cvMeta.name} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Web Format CV Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Experience Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Briefcase size={22} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Kinh nghiệm làm việc
                </h2>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                {experienceTimeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-800 shadow-sm"></div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <Calendar size={14} />
                        <span>{item.period}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.role}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {item.company}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Achievements Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <GraduationCap size={22} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Học vấn & Chứng chỉ
                </h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Cử nhân Công nghệ Thông tin
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      GPA 3.01 / 4.0
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Trường Đại học Công nghệ Sài Gòn (STU)
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Thời gian: 2022 - 2026
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> Thành tích & Chứng chỉ
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>Hoàn thành chương trình đào tạo Kỹ sư CNTT</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
