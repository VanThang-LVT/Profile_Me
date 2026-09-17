import React, { useState } from 'react';
import { 
  Shield, FileText, UploadCloud, FileSpreadsheet, CheckCircle2, 
  AlertCircle, X, Download, Lock, RefreshCw, Trash2, User, KeyRound, LogOut 
} from 'lucide-react';
import { saveCvPdf, clearCvPdf, saveTranscriptData, saveProfileInfo } from '../utils/storage';
import { parseTranscriptExcel, generateExcelTemplate } from '../utils/excelParser';
import { setAdminPassword } from '../utils/auth';
import { initialTranscriptData } from '../data/defaultData';

export const AdminDashboard = ({ 
  isOpen, 
  onClose, 
  cvMeta, 
  setCvMeta, 
  transcriptData, 
  setTranscriptData, 
  profile, 
  setProfile, 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' | 'excel' | 'profile' | 'security'
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // PDF CV Upload state
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Excel Upload state
  const [parsedPreview, setParsedPreview] = useState(null);
  const [excelError, setExcelError] = useState('');

  // Password change state
  const [newPassword, setNewPassword] = useState('');

  // Profile Edit Form state
  const [profileForm, setProfileForm] = useState(profile);

  if (!isOpen) return null;

  const showToast = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  // Handle PDF File Upload
  const handlePdfUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('error', 'Chỉ chấp nhận file định dạng PDF (.pdf).');
      return;
    }
    try {
      setIsUploadingPdf(true);
      const meta = await saveCvPdf(file);
      setCvMeta(meta);
      showToast('success', `Đã lưu file CV PDF "${file.name}" thành công!`);
    } catch (err) {
      showToast('error', 'Lỗi khi lưu file PDF: ' + err.message);
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Handle Clear CV PDF
  const handleClearPdf = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa file PDF CV hiện tại không?')) {
      clearCvPdf();
      setCvMeta(null);
      showToast('success', 'Đã xóa file PDF CV, hệ thống đã chuyển về mẫu Web CV.');
    }
  };

  // Handle Excel File Parsing
  const handleExcelUpload = (file) => {
    if (!file) return;
    setExcelError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const result = parseTranscriptExcel(buffer);
        setParsedPreview(result);
      } catch (err) {
        setExcelError(err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Save Excel Parsed Data
  const handleSaveExcelData = () => {
    if (parsedPreview) {
      saveTranscriptData(parsedPreview);
      setTranscriptData(parsedPreview);
      setParsedPreview(null);
      showToast('success', 'Đã cập nhật Bảng điểm mới vào trang web thành công!');
    }
  };

  // Clear Transcript Data
  const handleClearTranscriptData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dữ liệu bảng điểm hiện tại không?')) {
      localStorage.removeItem('profile_me_transcript_data');
      setTranscriptData(initialTranscriptData);
      setParsedPreview(null);
      showToast('success', 'Đã xóa toàn bộ dữ liệu bảng điểm!');
    }
  };

  // Save Profile Info
  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfileInfo(profileForm);
    setProfile(profileForm);
    showToast('success', 'Đã cập nhật thông tin cá nhân!');
  };

  // Change Admin Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    const res = setAdminPassword(newPassword);
    if (res.success) {
      showToast('success', res.message);
      setNewPassword('');
    } else {
      showToast('error', res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 my-8 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Shield size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Trang Quản Trị Hệ Thống (Admin Panel)
              </h2>
              <p className="text-xs text-slate-400">
                Tải lên CV (PDF), Phân tích file Bảng điểm Excel & Cập nhật Hồ sơ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold transition-colors"
            >
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Toast Alert */}
        {statusMsg.text && (
          <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 pt-4 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cv')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm border-b-2 transition-all ${
              activeTab === 'cv'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText size={18} />
            <span>File CV (PDF)</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm border-b-2 transition-all ${
              activeTab === 'excel'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet size={18} />
            <span>File Bảng Điểm (Excel)</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User size={18} />
            <span>Sửa Thông Tin Hồ Sơ</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound size={18} />
            <span>Đổi Mật Khẩu Admin</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: CV PDF UPLOAD */}
          {activeTab === 'cv' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Quản lý File PDF CV
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tải lên file PDF CV của bạn để người xem có thể đọc trực tiếp và tải bản gốc.
                </p>
              </div>

              {/* Current PDF Info Card */}
              {cvMeta ? (
                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-600 text-white">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {cvMeta.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kích thước: {(cvMeta.size / 1024).toFixed(1)} KB • Ngày upload: {new Date(cvMeta.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClearPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 font-semibold text-xs hover:bg-rose-200 transition-colors"
                  >
                    <Trash2 size={15} />
                    <span>Xóa PDF</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  Chưa có file PDF CV nào được upload. Trang web hiện hiển thị mẫu Web CV mặc định.
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-700/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files && handlePdfUpload(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      Nhấp vào đây hoặc Kéo thả file PDF CV vào đây
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Hỗ trợ định dạng file PDF (.pdf)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXCEL TRANSCRIPT UPLOAD */}
          {activeTab === 'excel' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tải lên & Phân tích Bảng điểm Excel (.xlsx)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tự động đọc các cột môn học, tín chỉ, điểm số và cập nhật biểu đồ GPA
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {transcriptData && transcriptData.subjects && transcriptData.subjects.length > 0 && (
                    <button
                      onClick={handleClearTranscriptData}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={15} />
                      <span>Xóa Bảng Điểm</span>
                    </button>
                  )}
                  <button
                    onClick={generateExcelTemplate}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Download size={15} />
                    <span>Tải File Excel Mẫu (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Excel Dropzone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-700/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => e.target.files && handleExcelUpload(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                    <FileSpreadsheet size={32} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      Nhấp vào đây hoặc Kéo thả file Excel bảng điểm (.xlsx)
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Hệ thống tự động tìm tiêu đề cột: Mã môn, Tên môn, Số tín chỉ, Điểm hệ 10/4
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {excelError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  <strong>Lỗi phân tích Excel:</strong> {excelError}
                </div>
              )}

              {/* Parsed Result Preview */}
              {parsedPreview && (
                <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800/60 pb-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-base">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                      <span>Đã trích xuất xong dữ liệu Excel!</span>
                    </div>
                    <button
                      onClick={handleSaveExcelData}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Xác nhận Cập nhật Bảng điểm
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl">
                      <span className="block text-[11px] text-slate-400">Số môn đọc được</span>
                      <strong className="text-lg text-slate-900 dark:text-white">{parsedPreview.subjects.length} môn</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl">
                      <span className="block text-[11px] text-slate-400">Tổng tín chỉ</span>
                      <strong className="text-lg text-emerald-600">{parsedPreview.totalCredits} TC</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl">
                      <span className="block text-[11px] text-slate-400">GPA (Hệ 4)</span>
                      <strong className="text-lg text-blue-600">{parsedPreview.overallGpa4} / 4.0</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl">
                      <span className="block text-[11px] text-slate-400">Xếp loại</span>
                      <strong className="text-lg text-amber-600">{parsedPreview.classification}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EDIT PROFILE INFO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Chỉnh sửa Thông tin Cá nhân
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Họ và tên</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Chức danh / Role</label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Trường Đại học</label>
                  <input
                    type="text"
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Chuyên ngành</label>
                  <input
                    type="text"
                    value={profileForm.major}
                    onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Đường dẫn / Link Ảnh Đại Diện (Avatar)</label>
                  <input
                    type="text"
                    placeholder="/avatar.png hoặc link URL ảnh"
                    value={profileForm.avatar || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mô tả bản thân (Bio)</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
              >
                Lưu Thay Đổi Thông Tin
              </button>
            </form>
          )}

          {/* TAB 4: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Đổi Mật Khẩu Admin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đặt mật khẩu mới để bảo vệ trang quản trị của bạn
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
              >
                Cập Nhật Mật Khẩu Mới
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
