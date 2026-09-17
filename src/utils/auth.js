const AUTH_KEY = 'profile_me_admin_authed';
const PASSWORD_KEY = 'profile_me_admin_password';
const DEFAULT_PASSWORD = 'admin123';

export const getAdminPassword = () => {
  const saved = localStorage.getItem(PASSWORD_KEY);
  return saved ? saved.trim() : DEFAULT_PASSWORD;
};

export const setAdminPassword = (newPassword) => {
  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 4 ký tự.' };
  }
  localStorage.setItem(PASSWORD_KEY, newPassword.trim());
  return { success: true, message: 'Đã cập nhật mật khẩu quản trị thành công!' };
};

export const resetAdminPassword = () => {
  localStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);
  return { success: true, message: 'Đã đặt lại mật khẩu về mặc định (admin123)!' };
};

export const checkAdminAuth = () => {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
};

export const loginAdmin = (password) => {
  const currentPassword = getAdminPassword();
  const inputPass = (password || '').trim();
  const targetPass = (currentPassword || DEFAULT_PASSWORD).trim();

  // Allow either current custom password or default password as fallback
  if (inputPass === targetPass || inputPass === DEFAULT_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return { success: true };
  }
  return { success: false, message: 'Mật khẩu quản trị không chính xác! (Mặc định: admin123)' };
};

export const logoutAdmin = () => {
  sessionStorage.removeItem(AUTH_KEY);
};
