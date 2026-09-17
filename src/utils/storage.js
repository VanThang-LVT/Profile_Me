const TRANSCRIPT_STORAGE_KEY = 'profile_me_transcript_data';
const PROFILE_STORAGE_KEY = 'profile_me_info_data';
const CV_STORAGE_KEY = 'profile_me_cv_pdf';

// Save and Load Profile Info
export const saveProfileInfo = (data) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
};

export const loadProfileInfo = (fallbackData) => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi đọc dữ liệu profile:", e);
    }
  }
  return fallbackData;
};

// Save and Load Transcript Data
export const saveTranscriptData = (data) => {
  localStorage.setItem(TRANSCRIPT_STORAGE_KEY, JSON.stringify(data));
};

export const loadTranscriptData = (fallbackData) => {
  const saved = localStorage.getItem(TRANSCRIPT_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi đọc dữ liệu bảng điểm:", e);
    }
  }
  return fallbackData;
};

// Save and Load CV PDF as Base64 Data URL
export const saveCvPdf = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64Data = reader.result;
        const fileMeta = {
          name: file.name,
          type: file.type,
          size: file.size,
          updatedAt: new Date().toISOString(),
          dataUrl: base64Data
        };
        localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(fileMeta));
        resolve(fileMeta);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const loadCvPdf = () => {
  const saved = localStorage.getItem(CV_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi đọc file CV:", e);
    }
  }
  // Default public CV file fallback for online deployment
  return {
    name: "CV_LuongVanThang.pdf",
    type: "application/pdf",
    size: 524288,
    updatedAt: new Date().toISOString(),
    dataUrl: "/CV.pdf"
  };
};

export const clearCvPdf = () => {
  localStorage.removeItem(CV_STORAGE_KEY);
};
