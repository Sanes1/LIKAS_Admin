import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LGUDashboard          from './pages/Lgudashboard.jsx'
import PostANeed              from './pages/Postaneed.jsx'
import CompetencyTagging      from './pages/Competencytagging.jsx'
import AllMissions            from './pages/Allmissions.jsx'
import ProductivityAnalytics  from './pages/Productivityanalytics.jsx'
import LGULogin               from './pages/Lgulogin.jsx'
import ReviewSubmissions      from './pages/Reviewsubmissions.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lgu/login" replace />} />
        <Route path="/lgu/login" element={<LGULogin />} />

        {/* Built */}
        <Route path="/lgu"       element={<LGUDashboard />} />
        <Route path="/lgu/post"  element={<PostANeed />} />
        <Route path="/lgu/missions" element={<AllMissions />} />
        <Route path="/lgu/analytics" element={<ProductivityAnalytics />} />
        <Route path="/lgu/review" element={<ReviewSubmissions />} />

        {/* Placeholders — swap in as screens are built */}
        <Route path="/lgu/tagging"       element={<CompetencyTagging />} />
        
        {/* Redirect old collaboration route to tagging */}
        <Route path="/lgu/collaboration" element={<Navigate to="/lgu/tagging" replace />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/lgu" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App