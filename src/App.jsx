import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AboutSection } from './components/AboutSection';
import { ResumeSection } from './components/ResumeSection';
import { TranscriptSection } from './components/TranscriptSection';
import { ContactSection } from './components/ContactSection';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { initialProfileInfo, initialTranscriptData } from './data/defaultData';
import { loadProfileInfo, loadTranscriptData, loadCvPdf } from './utils/storage';
import { checkAdminAuth, logoutAdmin } from './utils/auth';

export function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Core Data States
  const [profile, setProfile] = useState(() => loadProfileInfo(initialProfileInfo));
  const [transcriptData, setTranscriptData] = useState(() => loadTranscriptData(initialTranscriptData));
  const [cvMeta, setCvMeta] = useState(() => loadCvPdf());

  // Admin Auth States
  const [isAdmin, setIsAdmin] = useState(() => checkAdminAuth());

  // Sync Dark Mode class on html tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Fixed Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Page Container with React Router Routes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <AboutSection
                profile={profile}
                transcriptData={transcriptData}
                onNavigate={(tab) => {
                  if (tab === 'resume') navigate('/resume');
                  else if (tab === 'transcript') navigate('/transcript');
                  else if (tab === 'contact') navigate('/contact');
                  else navigate('/');
                }}
              />
            }
          />
          <Route
            path="/resume"
            element={
              <ResumeSection
                cvMeta={cvMeta}
              />
            }
          />
          <Route
            path="/transcript"
            element={
              <TranscriptSection
                transcriptData={transcriptData}
              />
            }
          />
          <Route path="/contact" element={<ContactSection profile={profile} />} />

          {/* Admin Dedicated Route */}
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard
                  isOpen={true}
                  onClose={() => navigate('/')}
                  cvMeta={cvMeta}
                  setCvMeta={setCvMeta}
                  transcriptData={transcriptData}
                  setTranscriptData={setTranscriptData}
                  profile={profile}
                  setProfile={setProfile}
                  onLogout={handleLogout}
                />
              ) : (
                <AdminLoginModal
                  isOpen={true}
                  onClose={() => navigate('/')}
                  onSuccess={() => setIsAdmin(true)}
                />
              )
            }
          />
          
          {/* Fallback to Home for unknown URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
