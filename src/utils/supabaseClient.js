import { createClient } from '@supabase/supabase-js';

const CONFIG_KEY = 'profile_me_supabase_config';
export const STORE_TABLE = 'profile_store';
export const BUCKET_NAME = 'profile-files';

// Priority: 1. Environment variables, 2. LocalStorage configuration
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isEnv: true };
  }
  
  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { ...parsed, isEnv: false };
      }
    } catch (e) {
      console.error("Lỗi đọc cấu hình Supabase:", e);
    }
  }
  return { url: '', key: '', isEnv: false };
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
};

export const saveSupabaseConfig = (url, key) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
};

let cachedClient = null;
let cachedConfigKey = '';

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;
  
  const currentKey = `${url}___${key}`;
  if (cachedClient && cachedConfigKey === currentKey) {
    return cachedClient;
  }
  
  try {
    cachedClient = createClient(url, key);
    cachedConfigKey = currentKey;
    return cachedClient;
  } catch (err) {
    console.error("Lỗi khởi tạo Supabase client:", err);
    return null;
  }
};

// Fetch single key from Supabase DB table
export const fetchCloudDataKey = async (key) => {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from(STORE_TABLE)
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.warn(`Lỗi fetch "${key}" từ Supabase:`, error.message);
      return null;
    }
    return data ? data.value : null;
  } catch (err) {
    console.warn(`Lỗi kết nối Supabase ("${key}"):`, err);
    return null;
  }
};

// Save single key to Supabase DB table
export const saveCloudDataKey = async (key, value) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Chưa cấu hình Cloud Storage (Supabase)' };
  try {
    const { error } = await client
      .from(STORE_TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.error(`Lỗi lưu "${key}" lên Supabase:`, error);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error(`Lỗi lưu "${key}" lên Supabase:`, err);
    return { success: false, message: err.message };
  }
};

// Upload file to Supabase Storage Bucket & get public URL
export const uploadCloudFile = async (file, customName = '') => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Chưa cấu hình Cloud Storage (Supabase)' };
  try {
    const ext = file.name.split('.').pop() || 'pdf';
    const filePath = customName || `CV_${Date.now()}.${ext}`;

    const { error: uploadErr } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadErr) {
      console.error('Lỗi upload file lên Supabase Storage:', uploadErr);
      return { success: false, message: uploadErr.message };
    }

    const { data: publicUrlData } = client.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    const fileMeta = {
      name: file.name,
      type: file.type,
      size: file.size,
      updatedAt: new Date().toISOString(),
      dataUrl: publicUrl
    };

    // Save meta to DB key 'cv_pdf'
    await saveCloudDataKey('cv_pdf', fileMeta);

    return { success: true, fileMeta };
  } catch (err) {
    console.error('Lỗi upload file lên Cloud Storage:', err);
    return { success: false, message: err.message };
  }
};

// Test connection & table setup
export const testSupabaseConnection = async (url, key) => {
  if (!url || !key) return { success: false, message: 'Vui lòng điền đủ Supabase URL và Anon Key.' };
  try {
    const tempClient = createClient(url.trim(), key.trim());
    const { error } = await tempClient.from(STORE_TABLE).select('key').limit(1);
    
    if (error) {
      // Check if table missing error (PostgREST code 42P01 or message)
      if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
        return { 
          success: false, 
          tableMissing: true,
          message: `Kết nối URL & Key thành công, nhưng chưa tìm thấy bảng "${STORE_TABLE}". Hãy tạo bảng bằng câu lệnh SQL hướng dẫn bên dưới.` 
        };
      }
      return { success: false, message: `Lỗi kết nối Supabase: ${error.message}` };
    }

    // Check storage bucket
    const { error: bucketErr } = await tempClient.storage.from(BUCKET_NAME).list('', { limit: 1 });
    if (bucketErr) {
      return {
        success: true,
        bucketWarning: true,
        message: `Đã kết nối Database thành công! Tuy nhiên Bucket "${BUCKET_NAME}" chưa được tạo trên Supabase Storage.`
      };
    }

    return { success: true, message: 'Kết nối Supabase Cloud Storage hoàn toàn thành công!' };
  } catch (err) {
    return { success: false, message: 'Không thể kết nối đến Supabase: ' + err.message };
  }
};
