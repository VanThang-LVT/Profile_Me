import React, { useState, useEffect } from 'react';
import { 
  Shield, FileText, UploadCloud, FileSpreadsheet, CheckCircle2, 
  AlertCircle, X, Download, Trash2, User, KeyRound, LogOut, Cloud, Copy, Check, ExternalLink, RefreshCw
} from 'lucide-react';
import { saveCvPdf, clearCvPdf, saveTranscriptData, saveProfileInfo } from '../utils/storage';
import { parseTranscriptExcel, generateExcelTemplate } from '../utils/excelParser';
import { setAdminPassword } from '../utils/auth';
import { initialTranscriptData } from '../data/defaultData';
import { 
  getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, 
  testSupabaseConnection, isSupabaseConfigured, uploadCloudFile, 
  saveCloudDataKey, STORE_TABLE, BUCKET_NAME 
} from '../utils/supabaseClient';

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
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' | 'excel' | 'profile' | 'cloud' | 'security'
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // PDF CV Upload state
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Excel Upload state
  const [parsedPreview, setParsedPreview] = useState(null);
  const [excelError, setExcelError] = useState('');
  const [isSavingExcel, setIsSavingExcel] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');

  // Profile Edit Form state
  const [profileForm, setProfileForm] = useState(profile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  // Supabase Cloud Config State
  const [cloudConfig, setCloudConfig] = useState(() => getSupabaseConfig());
  const [testingCloud, setTestingCloud] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Image upload handler (Avatar & Cover Image)
  const handleImageUpload = async (file, fieldKey) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Vui lòng chọn file định dạng hình ảnh (.jpg, .png, .jpeg, .webp).');
      return;
    }
    try {
      setIsUploadingImg(true);
      if (isSupabaseConfigured()) {
        const fileName = `${fieldKey}_${Date.now()}_${file.name}`;
        const res = await uploadCloudFile(file, fileName);
        if (res.success && res.fileMeta) {
          setProfileForm(prev => ({ ...prev, [fieldKey]: res.fileMeta.dataUrl }));
          showToast('success', `Đã tải ${fieldKey === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'} lên Cloud Storage thành công!`);
        } else {
          showToast('error', `Lỗi tải ảnh: ${res.message}`);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileForm(prev => ({ ...prev, [fieldKey]: e.target.result }));
          showToast('success', `Đã chọn ảnh! (Hãy bật Cloud Storage để đồng bộ cho các thiết bị khác).`);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      showToast('error', 'Lỗi khi xử lý hình ảnh: ' + err.message);
    } finally {
      setIsUploadingImg(false);
    }
  };

  if (!isOpen) return null;

  const showToast = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
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

      // Check if Cloud Storage is configured
      if (isSupabaseConfigured()) {
        const res = await uploadCloudFile(file, 'CV.pdf');
        if (res.success && res.fileMeta) {
          setCvMeta(res.fileMeta);
          showToast('success', `Đã tải file CV "${file.name}" lên Cloud Storage (Supabase) thành công! Tất cả thiết bị đều sẽ thấy file này.`);
        } else {
          // Fallback to local save if cloud fails
          const localMeta = await saveCvPdf(file);
          setCvMeta(localMeta);
          showToast('error', `Lỗi tải lên Cloud Storage: ${res.message}. File đã được lưu tạm vào máy này.`);
        }
      } else {
        // Local storage fallback
        const meta = await saveCvPdf(file);
        setCvMeta(meta);
        showToast('success', `Đã lưu file CV "${file.name}" vào bộ nhớ máy này. ⚠️ Hãy cấu hình tab Cloud Storage để đồng bộ cho tất cả các thiết bị khác!`);
      }
    } catch (err) {
      showToast('error', 'Lỗi khi lưu file PDF: ' + err.message);
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Handle Clear CV PDF
  const handleClearPdf = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa file PDF CV hiện tại không?')) {
      clearCvPdf();
      if (isSupabaseConfigured()) {
        await saveCloudDataKey('cv_pdf', null);
      }
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
  const handleSaveExcelData = async () => {
    if (!parsedPreview) return;
    try {
      setIsSavingExcel(true);
      
      // Save locally
      saveTranscriptData(parsedPreview);
      setTranscriptData(parsedPreview);

      // Save to Cloud if configured
      if (isSupabaseConfigured()) {
        const cloudRes = await saveCloudDataKey('transcript_data', parsedPreview);
        if (cloudRes.success) {
          showToast('success', 'Đã cập nhật Bảng điểm thành công lên Cloud Storage! Tất cả các thiết bị sẽ thấy Bảng điểm mới này.');
        } else {
          showToast('error', `Đã lưu ở máy này nhưng lỗi đồng bộ Cloud: ${cloudRes.message}`);
        }
      } else {
        showToast('success', 'Đã cập nhật Bảng điểm vào trình duyệt này! ⚠️ Hãy bật tab Cloud Storage để tất cả thiết bị khác nhận được dữ liệu.');
      }
      
      setParsedPreview(null);
    } catch (err) {
      showToast('error', 'Lỗi khi lưu bảng điểm: ' + err.message);
    } finally {
      setIsSavingExcel(false);
    }
  };

  // Clear Transcript Data
  const handleClearTranscriptData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dữ liệu bảng điểm hiện tại không?')) {
      localStorage.removeItem('profile_me_transcript_data');
      if (isSupabaseConfigured()) {
        await saveCloudDataKey('transcript_data', null);
      }
      setTranscriptData(initialTranscriptData);
      setParsedPreview(null);
      showToast('success', 'Đã xóa toàn bộ dữ liệu bảng điểm!');
    }
  };

  // Save Profile Info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      saveProfileInfo(profileForm);
      setProfile(profileForm);

      if (isSupabaseConfigured()) {
        const res = await saveCloudDataKey('profile_info', profileForm);
        if (res.success) {
          showToast('success', 'Đã lưu thông tin Hồ sơ thành công lên Cloud Storage!');
        } else {
          showToast('error', `Đã lưu ở máy này nhưng lỗi đồng bộ Cloud: ${res.message}`);
        }
      } else {
        showToast('success', 'Đã cập nhật thông tin cá nhân ở máy này!');
      }
    } catch (err) {
      showToast('error', 'Lỗi khi lưu profile: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
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

  // Save Cloud Configuration
  const handleSaveCloudConfig = async (e) => {
    e.preventDefault();
    setTestingCloud(true);
    const test = await testSupabaseConnection(cloudConfig.url, cloudConfig.key);
    setTestingCloud(false);

    if (test.success) {
      saveSupabaseConfig(cloudConfig.url, cloudConfig.key);
      showToast('success', 'Đã lưu cấu hình Cloud Storage (Supabase) thành công! Trang web hiện tự động kết nối Cloud.');
    } else if (test.tableMissing) {
      saveSupabaseConfig(cloudConfig.url, cloudConfig.key);
      showToast('error', test.message);
    } else {
      showToast('error', test.message);
    }
  };

  // Test Cloud Connection
  const handleTestCloudConnection = async () => {
    setTestingCloud(true);
    const res = await testSupabaseConnection(cloudConfig.url, cloudConfig.key);
    setTestingCloud(false);

    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  // Clear Cloud Config
  const handleClearCloudConfig = () => {
    if (window.confirm('Bạn có chắc chắn muốn ngắt kết nối Cloud Storage không?')) {
      clearSupabaseConfig();
      setCloudConfig({ url: '', key: '', isEnv: false });
      showToast('success', 'Đã ngắt kết nối Cloud Storage.');
    }
  };

  // SQL Script text to copy
  const sqlScript = `-- 1. Tạo bảng lưu dữ liệu Profile & Bảng điểm:
CREATE TABLE IF NOT EXISTS public.${STORE_TABLE} (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tắt RLS cho bảng dữ liệu:
ALTER TABLE public.${STORE_TABLE} DISABLE ROW LEVEL SECURITY;

-- 3. Xóa chính sách cũ nếu có & Cấp quyền upload/xem file công khai cho Storage Bucket '${BUCKET_NAME}':
DROP POLICY IF EXISTS "Allow Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Update" ON storage.objects;

CREATE POLICY "Allow Public Select" ON storage.objects FOR SELECT USING (bucket_id = '${BUCKET_NAME}');
CREATE POLICY "Allow Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = '${BUCKET_NAME}');
CREATE POLICY "Allow Public Update" ON storage.objects FOR UPDATE USING (bucket_id = '${BUCKET_NAME}');`;

  const copySqlScript = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const isCloudConnected = isSupabaseConfigured();

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
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Trang Quản Trị Hệ Thống (Admin Panel)
                </h2>
                {isCloudConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Cloud Online
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Local Only
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Quản lý CV (PDF), Phân tích Bảng điểm Excel, Cập nhật Hồ sơ & Cấu hình Cloud Storage
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

        {/* Cloud Notification Warning Banner if not configured */}
        {!isCloudConnected && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <Cloud size={18} className="text-amber-600 shrink-0" />
              <span>
                <strong>Lưu ý:</strong> Chưa bật Cloud Storage! Các thay đổi chỉ lưu trên thiết bị này. Nhấp vào tab <strong>"Cloud Storage (Supabase)"</strong> bên dưới để kết nối miễn phí trong 2 phút!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('cloud')}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0 shadow-sm"
            >
              Cấu hình ngay
            </button>
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
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm border-b-2 transition-all ${
              activeTab === 'cloud'
                ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cloud size={18} />
            <span>Cloud Storage (Supabase)</span>
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
                  Tải lên file PDF CV của bạn. {isCloudConnected ? 'File được tự động đẩy lên Cloud Storage để người xem trên mọi thiết bị đều đọc được bản mới nhất.' : 'Tải file để hiển thị trực tiếp.'}
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
                      <span className="inline-block mt-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 truncate max-w-xs sm:max-w-md">
                        URL: {cvMeta.dataUrl?.slice(0, 60)}...
                      </span>
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
              <div className={`border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-700/30 transition-all relative ${
                isUploadingPdf ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
              }`}>
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={isUploadingPdf}
                  onChange={(e) => e.target.files && handlePdfUpload(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    {isUploadingPdf ? <RefreshCw size={32} className="animate-spin" /> : <UploadCloud size={32} />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {isUploadingPdf ? 'Đang tải file CV lên Cloud Storage...' : 'Nhấp vào đây hoặc Kéo thả file PDF CV vào đây'}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Hỗ trợ định dạng file PDF (.pdf) • {isCloudConnected ? 'Đồng bộ Cloud Online' : 'Bộ nhớ địa phương'}
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
                      disabled={isSavingExcel}
                      onClick={handleSaveExcelData}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      {isSavingExcel && <RefreshCw size={14} className="animate-spin" />}
                      <span>Xác nhận Cập nhật Bảng điểm</span>
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
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Chỉnh sửa Thông tin Cá nhân & Ảnh Bìa
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cập nhật hình ảnh đại diện, ảnh bìa banner và các thông tin liên hệ của bạn.
                  </p>
                </div>
              </div>

              {/* Cover Image & Avatar Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  1. Hình ảnh Profile (Ảnh bìa & Avatar)
                </h4>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                    Ảnh Bìa Banner (Cover Image)
                  </label>
                  {profileForm.coverImage && (
                    <div className="h-28 w-full rounded-xl overflow-hidden relative border border-slate-300 dark:border-slate-600">
                      <img src={profileForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, coverImage: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs shadow-md"
                      >
                        Xóa ảnh bìa
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Dán URL ảnh bìa online (ví dụ: https://images.unsplash.com/...)"
                      value={profileForm.coverImage || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, coverImage: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                    />
                    <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shrink-0 transition-colors flex items-center gap-1.5">
                      <UploadCloud size={15} />
                      <span>Tải ảnh từ máy</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'coverImage')}
                      />
                    </label>
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                    Ảnh Đại Diện (Avatar)
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={profileForm.avatar || "/avatar.png"}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Link Avatar (ví dụ: /avatar.png hoặc URL ảnh online)"
                        value={profileForm.avatar || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-colors">
                        <UploadCloud size={14} />
                        <span>Tải Avatar mới từ máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'avatar')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details Form */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  2. Thông tin Cá nhân & Học vấn
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Họ và tên</label>
                    <input
                      type="text"
                      value={profileForm.fullName || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Chức danh / Role</label>
                    <input
                      type="text"
                      value={profileForm.title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Trường Đại học</label>
                    <input
                      type="text"
                      value={profileForm.university || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Chuyên ngành</label>
                    <input
                      type="text"
                      value={profileForm.major || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mã Sinh Viên</label>
                    <input
                      type="text"
                      value={profileForm.studentId || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Địa chỉ / Thành phố</label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email liên hệ</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Số điện thoại</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  3. Link Mạng xã hội & Code
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Link GitHub</label>
                    <input
                      type="url"
                      value={profileForm.github || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Link LinkedIn</label>
                    <input
                      type="url"
                      value={profileForm.linkedin || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Link Facebook</label>
                    <input
                      type="url"
                      value={profileForm.facebook || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, facebook: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Description */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Mô tả bản thân (Bio)</label>
                <textarea
                  rows={4}
                  value={profileForm.bio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                {isSavingProfile && <RefreshCw size={16} className="animate-spin" />}
                <span>Lưu Thay Đổi Thông Tin Hồ Sơ</span>
              </button>
            </form>
          )}

          {/* TAB 4: CLOUD STORAGE CONFIGURATION (SUPABASE) */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cloud className="text-cyan-500" size={22} />
                    <span>Cấu hình Cloud Storage (Supabase Free)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lưu trữ file CV & dữ liệu Bảng điểm trên Cloud để tất cả thiết bị trên toàn thế giới luôn nhận thông tin mới nhất.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <span>Mở Supabase.com</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isCloudConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isCloudConnected ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                    <Cloud size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      Trạng thái Cloud Storage: {isCloudConnected ? '🟢 Đã Kết Nối Online' : '🔴 Chưa Kết Nối'}
                    </h4>
                    <p className="text-xs opacity-80">
                      {isCloudConnected
                        ? `Đang sử dụng ${cloudConfig.isEnv ? 'Biến môi trường (.env)' : 'Cấu hình Admin'}`
                        : 'Web đang dùng bộ nhớ tạm local. Kết nối Supabase để nhận đồng bộ tất cả các thiết bị.'}
                    </p>
                  </div>
                </div>

                {isCloudConnected && !cloudConfig.isEnv && (
                  <button
                    onClick={handleClearCloudConfig}
                    className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 text-xs font-semibold hover:bg-rose-200"
                  >
                    Ngắt kết nối
                  </button>
                )}
              </div>

              {/* Config Form */}
              <form onSubmit={handleSaveCloudConfig} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Thông số kết nối API (Project Settings -&gt; API)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://your-project-id.supabase.co"
                      value={cloudConfig.url}
                      onChange={(e) => setCloudConfig({ ...cloudConfig, url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Supabase Anon Public Key
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={cloudConfig.key}
                      onChange={(e) => setCloudConfig({ ...cloudConfig, key: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={testingCloud}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    {testingCloud && <RefreshCw size={14} className="animate-spin" />}
                    <span>Lưu & Kết Nối Cloud Storage</span>
                  </button>

                  <button
                    type="button"
                    disabled={testingCloud}
                    onClick={handleTestCloudConnection}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600 transition-all"
                  >
                    Kiểm Tra Kết Nối
                  </button>
                </div>
              </form>

              {/* Guide & SQL Copy Box */}
              <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-extrabold">!</span>
                    Hướng dẫn tạo Bảng & Bucket trên Supabase (Thực hiện 1 lần duy nhất trong 2 phút)
                  </h4>
                  <button
                    onClick={copySqlScript}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedSql ? 'Đã copy SQL!' : 'Copy mã SQL'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>Truy cập <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">Supabase.com</a>, tạo dự án mới (miễn phí 100%).</li>
                  <li>Vào mục <strong>SQL Editor</strong> ở menu bên trái, dán đoạn mã SQL bên dưới rồi bấm <strong>Run</strong>:</li>
                </ol>

                <pre className="p-4 rounded-xl bg-slate-950 text-cyan-300 text-xs font-mono overflow-x-auto border border-slate-800">
                  {sqlScript}
                </pre>

                <ol start={3} className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>Vào mục <strong>Storage</strong> ở menu bên trái -&gt; Bấm <strong>Create a new bucket</strong>.</li>
                  <li>Đặt tên Bucket là: <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">{BUCKET_NAME}</code> và bật công tắc <strong>Public bucket</strong> thành <strong>ON</strong>.</li>
                  <li>Vào <strong>Project Settings</strong> -&gt; <strong>API</strong> -&gt; Copy <strong>URL</strong> và <strong>anon public key</strong> dán vào ô bên trên rồi bấm "Lưu & Kết Nối"!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 5: CHANGE PASSWORD */}
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

export default AdminDashboard;
