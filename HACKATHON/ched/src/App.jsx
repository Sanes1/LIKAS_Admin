import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssessorLogin from './pages/Assessorlogin.jsx'
import AssessorDashboard from './pages/Assessordashboard.jsx'
import AIAssistedAudit from './pages/Aiassistedaudit.jsx'
import ProjectVerification from './pages/Projectverification.jsx'
import InterviewScriptGenerator from './pages/Interviewscriptgenerator.jsx'
import FinalAccreditation from './pages/Finalaccreditation.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<AssessorLogin />} />

        {/* Assessor portal */}
        <Route path="/assessor" element={<AssessorDashboard />} />
        <Route path="/assessor/audit/:id" element={<AIAssistedAudit />} />
        <Route path="/assessor/projects" element={<ProjectVerification />} />
        <Route path="/assessor/interview" element={<InterviewScriptGenerator />} />
        <Route path="/assessor/accreditation" element={<FinalAccreditation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App