import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import IntroductionPage from './pages/Introductionpage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PublicBarangayProjects from './pages/Publicbarangayprojects.jsx'
import MinorProjects from './pages/MinorProjects.jsx'
import MajorProjects from './pages/MajorProjects.jsx'
import SubmitProjects from './pages/SubmitProjects.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AccessibilitySettings from './components/AccessibilitySettings.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/projects" element={<PublicBarangayProjects />} />
        <Route path="/minor" element={<MinorProjects />} />
        <Route path="/major" element={<MajorProjects />} />
        <Route path="/submit" element={<SubmitProjects />} />
      </Routes>
      
      {/* Global Accessibility Settings - Available on all pages */}
      <AccessibilitySettings />
    </BrowserRouter>
  )
}

export default App