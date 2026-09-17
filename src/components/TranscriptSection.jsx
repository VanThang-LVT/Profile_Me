import React, { useState, useMemo, useEffect } from 'react';
import { Award, BookOpen, Search, Filter, TrendingUp, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Helper to shorten semester string for clean X-Axis display
const formatSemesterShort = (semesterStr) => {
  if (!semesterStr) return '';
  return semesterStr
    .replace(/Học kỳ\s*(\d+)/i, 'HK$1')
    .replace(/Năm học\s*/i, '')
    .replace(/(\d{4})\s*-\s*(\d{4})/, (m, y1, y2) => `(${y1.slice(2)}-${y2.slice(2)})`)
    .replace(/\s+/g, ' ')
    .trim();
};

export const TranscriptSection = ({ transcriptData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Số môn học hiển thị trên mỗi trang

  const hasSubjects = transcriptData && transcriptData.subjects && transcriptData.subjects.length > 0;

  // Extract unique list of semesters for filter dropdown
  const semestersList = useMemo(() => {
    if (!hasSubjects) return [];
    const set = new Set(transcriptData.subjects.map(s => s.semester));
    return Array.from(set);
  }, [transcriptData, hasSubjects]);

  // Filtered subject items based on search term & semester dropdown
  const filteredSubjects = useMemo(() => {
    if (!hasSubjects) return [];
    return transcriptData.subjects.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = selectedSemester === 'ALL' || item.semester === selectedSemester;
      return matchesSearch && matchesSemester;
    });
  }, [transcriptData, searchTerm, selectedSemester, hasSubjects]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSemester]);

  // Calculate pagination slices
  const totalPages = Math.ceil(filteredSubjects.length / pageSize) || 1;
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubjects.slice(start, start + pageSize);
  }, [filteredSubjects, currentPage, pageSize]);

  // Grade Badge Color helper
  const getGradeBadgeStyle = (letter) => {
    switch (letter) {
      case 'A+':
      case 'A':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'C+':
      case 'C':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
            <Award size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Bảng điểm Học tập & Kết quả tích lũy
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {transcriptData.lastUpdated 
                ? `Cập nhật ngày: ${transcriptData.lastUpdated}` 
                : 'Thông tin kết quả môn học'}
            </p>
          </div>
        </div>
      </div>

      {/* If Empty Data -> Display Empty State Card Prompting Excel Upload */}
      {!hasSubjects ? (
        <div className="p-10 md:p-14 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 text-center space-y-5 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-inner">
            <FileSpreadsheet size={40} />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Chưa có dữ liệu bảng điểm học tập
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Vui lòng tải lên file Excel bảng điểm (định dạng <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400 font-bold">.xlsx</code>).
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                GPA Tích lũy (Hệ 4)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {transcriptData.overallGpa4}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 4.0</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Thang điểm chuẩn quốc tế</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                GPA Tích lũy (Hệ 10)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {transcriptData.overallGpa10}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 10.0</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Thang điểm tổng kết môn</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Tổng số tín chỉ
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {transcriptData.totalCredits}
                </span>
                <span className="text-xs font-semibold text-slate-400">Tín chỉ</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Số môn đã hoàn thành</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Xếp loại học lực
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 truncate">
                  {transcriptData.classification}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Dựa trên quy chế tín chỉ</p>
            </div>
          </div>

          {/* GPA Trend Chart */}
          {transcriptData.semesterTrends && transcriptData.semesterTrends.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Biểu đồ diễn biến GPA qua các học kỳ
                    </h2>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 italic block sm:hidden font-medium">
                      👈 Vuốt ngang để xem tất cả học kỳ
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 shrink-0">Cập nhật từ Excel</span>
              </div>

              {/* Scrollable Container on Mobile */}
              <div className="w-full overflow-x-auto pb-2 touch-pan-x">
                <div className="h-64 min-w-[550px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transcriptData.semesterTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGpa4" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                      <XAxis 
                        dataKey="semester" 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        interval={0}
                        tickFormatter={formatSemesterShort}
                      />
                      <YAxis domain={[0, 4.0]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#fff',
                          fontSize: '13px'
                        }}
                        labelFormatter={(label) => `Học kỳ: ${label}`}
                        formatter={(value) => [`${value} / 4.0`, 'GPA Tích lũy (Hệ 4)']}
                      />
                      <Area type="monotone" dataKey="gpa4" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa4)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Subject Grade Table Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Chi tiết điểm các môn học ({filteredSubjects.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên môn, mã môn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {semestersList.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="px-3 py-2 pr-8 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="ALL">Tất cả các học kỳ</option>
                      {semestersList.map((sem, idx) => (
                        <option key={idx} value={sem}>{sem}</option>
                      ))}
                    </select>
                    <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Mã HP</th>
                    <th className="px-4 py-3">Tên môn học</th>
                    <th className="px-4 py-3 text-center">Số TC</th>
                    <th className="px-4 py-3 text-center">Điểm hệ 10</th>
                    <th className="px-4 py-3 text-center">Điểm hệ 4</th>
                    <th className="px-4 py-3 text-center">Điểm chữ</th>
                    <th className="px-4 py-3">Học kỳ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {paginatedSubjects.length > 0 ? (
                    paginatedSubjects.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white text-xs">
                          {item.code}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-600 dark:text-slate-300">
                          {item.credits}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                          {item.grade10}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {item.grade4}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getGradeBadgeStyle(item.letter)}`}>
                            {item.letter}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {item.semester}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                        Không tìm thấy môn học nào khớp với từ khóa tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Hiển thị môn {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredSubjects.length)} trong tổng số {filteredSubjects.length} môn
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold disabled:opacity-40 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft size={15} />
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === num
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold disabled:opacity-40 hover:bg-slate-200 transition-colors"
                  >
                    <span>Sau</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
