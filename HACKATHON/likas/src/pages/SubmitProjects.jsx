import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { analyzeProject, analyzeAnswers } from "../services/aiService";
import { updateStudentTokens, submitProject, unlockMajorProject, createNotification } from "../services/firestoreService";
import { Coins, Dna, FlaskConical, Globe, Calculator, Zap, Upload, CheckCircle, AlertCircle, Sparkles, Lock } from "lucide-react";
import TextToSpeech from "../components/TextToSpeech";

const SUBJECTS = [
  { id: "biology", title: "Biology", description: "Study living organisms and life processes", icon: Dna, color: "#10B981" },
  { id: "chemistry", title: "Chemistry", description: "Explore matter, elements, and reactions", icon: FlaskConical, color: "#8B5CF6" },
  { id: "earth-space", title: "Earth & Space", description: "Study Earth systems and space phenomena", icon: Globe, color: "#3B82F6" },
  { id: "finite-math", title: "Mathematics", description: "Apply discrete mathematics concepts", icon: Calculator, color: "#F59E0B" },
  { id: "physics", title: "Physics", description: "Understand motion, energy, and forces", icon: Zap, color: "#EF4444" },
];

const STEPS = [
  { num: "01", title: "Select Subject", desc: "Choose the subject area for your project submission" },
  { num: "02", title: "Upload Evidence", desc: "Submit your project work, calculations, or research findings" },
  { num: "03", title: "AI Review", desc: "AI analyzes your work and asks targeted questions" },
  { num: "04", title: "Remediation (if needed)", desc: "Get micro-remediation for identified weaknesses" },
  { num: "05", title: "Resubmit", desc: "Improve and resubmit based on AI feedback" },
];

export default function SubmitProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const missionFromState = location.state?.mission;
  const unlockMajor = location.state?.unlockMajor;
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [step, setStep] = useState(1);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [remediation, setRemediation] = useState(null);
  const [showRemediation, setShowRemediation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isMajorProject, setIsMajorProject] = useState(false);
  const [tokensDeducted, setTokensDeducted] = useState(false);

  useEffect(() => {
    // If coming from a mission, check if it's a Major project
    if (missionFromState && missionFromState.tier === 'Major') {
      setIsMajorProject(true);
      
      // If unlockMajor flag is set, deduct tokens immediately
      if (unlockMajor && !tokensDeducted) {
        handleMajorUnlock();
      }
    }
  }, [missionFromState, unlockMajor, tokensDeducted]);

  const handleMajorUnlock = async () => {
    const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
    
    if (studentData.uid) {
      try {
        const result = await unlockMajorProject(studentData.uid, 100);
        
        if (result.success) {
          setTokensDeducted(true);
          alert(`Successfully unlocked Major Capstone project!\n\nTokens spent: 100\nNew balance: ${result.newBalance} tokens`);
        } else {
          alert(`Failed to unlock project: ${result.error}`);
          navigate('/projects');
        }
      } catch (error) {
        console.error('Error unlocking major project:', error);
        alert('An error occurred while unlocking the project. Please try again.');
        navigate('/projects');
      }
    }
  };

  const handleSubjectSelect = (id) => {
    setSelectedSubject(id);
    setStep(2);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setStep(3);
    setIsAnalyzing(true);

    const subjectTitle = SUBJECTS.find(s => s.id === selectedSubject)?.title || "Unknown Subject";
    const projectContent = `Student submitted a project file: ${uploadedFile.name}. Please analyze based on ${subjectTitle} curriculum standards.`;

    const analysis = await analyzeProject(subjectTitle, projectContent);
    
    setAiQuestions(analysis.questions);
    setAnswers(new Array(analysis.questions.length).fill(""));
    setWeaknesses(analysis.weaknesses);
    setRemediation(analysis.remediation);
    setIsAnalyzing(false);
  };

  const handleAiResponse = async () => {
    console.log('🚀 Starting AI response analysis...');
    setIsAnalyzing(true);
    
    const subjectTitle = SUBJECTS.find(s => s.id === selectedSubject)?.title || "Unknown Subject";
    console.log('📚 Subject:', subjectTitle);
    console.log('❓ Questions:', aiQuestions);
    console.log('✍️ Answers:', answers);
    
    try {
      const analysis = await analyzeAnswers(subjectTitle, aiQuestions, answers);
      console.log('🤖 AI Analysis result:', analysis);
      
      if (!analysis.isSeriousAttempt) {
        console.warn('⚠️ AI detected non-serious attempt');
        setShowAlert(true);
        setIsAnalyzing(false);
        return;
      }
      
      setWeaknesses(analysis.weaknesses);
      setRemediation(analysis.remediation || {});
      setIsAnalyzing(false);
      
      // If no weaknesses, go to success screen (tokens will be added when LGU approves)
      if (analysis.weaknesses.length === 0) {
        console.log('✅ No weaknesses detected, proceeding with submission...');
        const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
        console.log('👤 Student data:', studentData);
        
        if (studentData.uid) {
          try {
            // NOTE: Tokens are NOT added here - they will be added when LGU approves
            console.log('📝 Submitting project for LGU approval (tokens pending approval)...');
            
            console.log('📝 Saving project to Firebase...');
            // Save project to Firebase with complete details
            const projectResult = await submitProject(studentData.uid, {
              subject: subjectTitle,
              subjectId: selectedSubject,
              tier: isMajorProject ? 'Major' : 'Minor',
              missionId: missionFromState?.id,
              missionTitle: missionFromState?.title,
              missionCategory: missionFromState?.category,
              missionBarangay: missionFromState?.barangay,
              missionCity: missionFromState?.city,
              fileName: uploadedFile?.name,
              fileSize: uploadedFile?.size,
              fileType: uploadedFile?.type,
              questions: aiQuestions,
              answers: answers,
              tokensEarned: isMajorProject ? 0 : 25, // Tokens pending LGU approval
              tokensSpent: isMajorProject ? 100 : 0, // Major projects cost 100 tokens
              tokensPending: !isMajorProject, // Flag to indicate tokens are pending approval
              studentName: studentData.username,
              studentLRN: studentData.lrn,
              studentEmail: studentData.email,
              school: studentData.school,
              color: SUBJECTS.find(s => s.id === selectedSubject)?.color || '#3B82F6',
              submittedAt: new Date().toISOString(),
              submissionStatus: 'pending', // New field for LGU approval
              status: 'completed', // AI review status
              grade: 'Passed',
              aiAnalysis: {
                weaknesses: analysis.weaknesses,
                strengths: analysis.strengths || [],
                feedback: analysis.feedback || 'Excellent work!'
              }
            });
            
            console.log('✅ Project submitted successfully:', projectResult);
            
            // Create notification for LGU
            try {
              console.log('🔔 Creating notification for LGU...');
              await createNotification({
                type: 'submission',
                studentName: studentData.username,
                studentLRN: studentData.lrn,
                missionTitle: missionFromState?.title || 'Project Submission',
                missionId: missionFromState?.id,
                projectId: projectResult.projectId,
                tier: isMajorProject ? 'Major' : 'Minor',
                subject: subjectTitle,
                message: `${studentData.username} submitted a ${isMajorProject ? 'Major' : 'Minor'} project for ${missionFromState?.title || 'review'}`
              });
              console.log('✅ LGU notification created');
            } catch (notifError) {
              console.error('⚠️ Failed to create notification (non-critical):', notifError);
              // Don't fail the submission if notification fails
            }
          } catch (error) {
            console.error('❌ Error submitting project:', error);
            console.error('Error details:', error.message, error.code);
            alert('There was an error submitting your project. Please check the console and try again.');
            setIsAnalyzing(false);
            return;
          }
        } else {
          console.error('❌ No student UID found in localStorage');
          alert('Student data not found. Please log in again.');
          setIsAnalyzing(false);
          return;
        }
        
        console.log('🎉 Moving to success screen (step 5)');
        setStep(5);
      } else {
        console.log('⚠️ Weaknesses detected, showing remediation');
        setShowRemediation(true);
        setStep(4);
      }
    } catch (error) {
      console.error('❌ Error in handleAiResponse:', error);
      console.error('Error details:', error.message, error.stack);
      alert('An error occurred during AI analysis. Please check the console and try again.');
      setIsAnalyzing(false);
    }
  };

  const handleResubmit = () => {
    setStep(2);
    setUploadedFile(null);
    setAiQuestions([]);
    setAnswers([]);
    setWeaknesses([]);
    setRemediation(null);
    setShowRemediation(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #F8FAFC 0%, #FFFFFF 100%)", fontFamily: "'Inter', sans-serif", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .subject-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .subject-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1); }
        .step-indicator { transition: all 0.3s ease; }
        .step-indicator.active { transform: scale(1.1); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#64748B", cursor: "pointer", marginBottom: "32px", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", color: "#0F172A", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            {isMajorProject ? (
              <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Lock size={36} color="#5B4FFF" />
                Submit Major Capstone Project
              </span>
            ) : (
              "Submit Your Project"
            )}
          </h1>
          <p style={{ fontSize: "16px", color: "#64748B", lineHeight: "1.6" }}>
            {isMajorProject 
              ? "You've unlocked a Major Capstone project! Complete this to fulfill your academic requirements."
              : "Follow the steps below to submit your work for AI-powered review and feedback"
            }
          </p>
          
          {isMajorProject && missionFromState && (
            <div style={{ marginTop: "16px", padding: "16px", background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#5B4FFF", marginBottom: "8px" }}>Mission Details:</h3>
              <p style={{ fontSize: "14px", color: "#4C1D95", marginBottom: "4px" }}><strong>Title:</strong> {missionFromState.title}</p>
              <p style={{ fontSize: "14px", color: "#4C1D95", marginBottom: "4px" }}><strong>Location:</strong> {missionFromState.barangay}, {missionFromState.city}</p>
              <p style={{ fontSize: "14px", color: "#4C1D95" }}><strong>Duration:</strong> {missionFromState.duration}</p>
            </div>
          )}
          
          {/* Text-to-Speech for accessibility */}
          <div style={{ marginTop: "16px" }}>
            <TextToSpeech 
              text={isMajorProject 
                ? "Submit Major Capstone Project. You've unlocked a Major Capstone project! Complete this to fulfill your academic requirements."
                : "Submit Your Project. Follow the steps below to submit your work for AI-powered review and feedback. Step 1: Select Subject. Step 2: Upload Evidence. Step 3: AI Review. Step 4: Remediation if needed. Step 5: Resubmit."
              }
            />
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px", overflowX: "auto", padding: "8px 0" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1", minWidth: "fit-content" }}>
              <div className={`step-indicator ${step >= i + 1 ? 'active' : ''}`} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: step >= i + 1 ? "#5B4FFF" : "#FFFFFF", borderRadius: "12px", border: step >= i + 1 ? "none" : "2px solid #E2E8F0", boxShadow: step >= i + 1 ? "0 4px 12px rgba(91, 79, 255, 0.2)" : "none" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: step >= i + 1 ? "#FFFFFF" : "#94A3B8", fontVariantNumeric: "tabular-nums" }}>{s.num}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: step >= i + 1 ? "#FFFFFF" : "#64748B", whiteSpace: "nowrap" }}>{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: "24px", height: "2px", background: step > i + 1 ? "#5B4FFF" : "#E2E8F0", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Subject */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#0F172A", marginBottom: "24px" }}>Choose Your Subject</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {SUBJECTS.map(sub => {
                const IconComponent = sub.icon;
                return (
                  <div key={sub.id} className="subject-card" onClick={() => handleSubjectSelect(sub.id)} style={{ padding: "28px", background: "#FFFFFF", border: "2px solid #E2E8F0", borderRadius: "16px", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <IconComponent size={40} color={sub.color} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>{sub.title}</h3>
                    <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.6" }}>{sub.description}</p>
                    <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: sub.color, opacity: 0.05, borderRadius: "0 16px 0 100%" }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Upload Evidence */}
        {step === 2 && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#0F172A", marginBottom: "24px" }}>Upload Your Work</h2>
            <div style={{ padding: "40px", background: "#FFFFFF", borderRadius: "20px", border: "2px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <label style={{ display: "block", border: "3px dashed #CBD5E1", borderRadius: "16px", padding: "60px 40px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", background: uploadedFile ? "#F5F3FF" : "#FAFAFA" }}>
                <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" style={{ display: "none" }} />
                <div style={{ width: "64px", height: "64px", margin: "0 auto 20px", background: uploadedFile ? "#F5F3FF" : "#F1F5F9", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Upload size={32} color={uploadedFile ? "#5B4FFF" : "#64748B"} strokeWidth={2} />
                </div>
                {uploadedFile ? (
                  <>
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#5B4FFF", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <CheckCircle size={20} /> {uploadedFile.name}
                    </p>
                    <p style={{ fontSize: "14px", color: "#64748B" }}>Click to change file</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>Drop your file here or click to browse</p>
                    <p style={{ fontSize: "14px", color: "#64748B" }}>PDF, DOCX, JPG, PNG • Max 10MB</p>
                  </>
                )}
              </label>
              <button onClick={handleUpload} disabled={!uploadedFile} style={{ marginTop: "24px", width: "100%", padding: "16px", background: uploadedFile ? "#1A1A1A" : "#E2E8F0", color: uploadedFile ? "#FFFFFF" : "#94A3B8", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: uploadedFile ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: uploadedFile ? "0 4px 12px rgba(26, 26, 26, 0.3)" : "none" }}>
                Continue to AI Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Review */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#0F172A", marginBottom: "20px" }}>AI Review</h2>
            {isAnalyzing ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ width: "48px", height: "48px", border: "4px solid #E2E8F0", borderTop: "4px solid #5B4FFF", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }}></div>
                <p style={{ color: "#475569" }}>AI is analyzing your project...</p>
              </div>
            ) : (
              <>
                <div style={{ background: "#F5F3FF", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ width: "32px", height: "32px", background: "#5B4FFF", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={18} color="white" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#4C1D95" }}>AI Assistant</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#4C1D95", lineHeight: "1.8" }}>
                    {aiQuestions.map((q, i) => (
                      <div key={i} style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <p><strong>{i + 1}.</strong> {q}</p>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <TextToSpeech 
                              text={`Question ${i + 1}. ${q}`}
                              buttonStyle={{ fontSize: "10px", padding: "4px 8px" }}
                            />
                            <button 
                              onClick={() => handleAnswerChange(i, `This is a comprehensive answer demonstrating understanding of ${SUBJECTS.find(s => s.id === selectedSubject)?.title}. I applied the concepts learned in class, conducted thorough research, and analyzed the results systematically. The methodology involved careful planning and execution following MATATAG curriculum standards.`)}
                              style={{ padding: "4px 12px", background: "#10B981", color: "#FFFFFF", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                              Use Demo Answer
                            </button>
                          </div>
                        </div>
                        <textarea 
                          value={answers[i] || ""} 
                          onChange={(e) => handleAnswerChange(i, e.target.value)}
                          placeholder="Type your answer here..."
                          style={{ width: "100%", minHeight: "80px", padding: "12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "13px", fontFamily: "'Inter', sans-serif", resize: "vertical" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleAiResponse} disabled={answers.some(a => !a.trim()) || isAnalyzing} style={{ padding: "12px 24px", background: (answers.some(a => !a.trim()) || isAnalyzing) ? "#CBD5E1" : "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: (answers.some(a => !a.trim()) || isAnalyzing) ? "not-allowed" : "pointer" }}>
                  {isAnalyzing ? "Analyzing..." : "Submit Responses"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 4: Remediation */}
        {showRemediation && (
          <div style={{ animation: "fadeUp 0.4s ease both", padding: "32px", background: "#FEF3C7", borderRadius: "12px", border: "1px solid #FDE68A", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <AlertCircle size={24} color="#9A3412" />
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#9A3412", margin: 0 }}>AI Detected Weaknesses</h2>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
              {weaknesses.map((w, i) => (
                <span key={i} style={{ padding: "6px 12px", background: "#FFFFFF", border: "1px solid #FDE68A", borderRadius: "99px", fontSize: "12px", color: "#9A3412", fontWeight: "500" }}>{w}</span>
              ))}
            </div>
            {remediation && Object.keys(remediation).length > 0 && (
              <>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#9A3412", marginBottom: "12px" }}>Micro-Remediation:</h3>
                <ul style={{ paddingLeft: "20px", color: "#78350F", fontSize: "13px", lineHeight: "1.8", marginBottom: "20px" }}>
                  {Object.entries(remediation).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </>
            )}
            <button onClick={handleResubmit} style={{ padding: "12px 24px", background: "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>Resubmit Project</button>
          </div>
        )}

        {/* Step 5: Completed */}
        {step === 5 && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ padding: "40px", background: "#F0FDF4", borderRadius: "12px", border: "1px solid #BBF7D0", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "64px", height: "64px", background: "#22C55E", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={32} color="white" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#166534", marginBottom: "12px" }}>
                {isMajorProject ? "Major Capstone Completed!" : "Project Submitted Successfully!"}
              </h2>
              <p style={{ color: "#15803D", marginBottom: "8px", fontSize: "15px", fontWeight: "500" }}>
                Your work has been submitted and is awaiting LGU approval.
              </p>
              <p style={{ color: "#15803D", marginBottom: "20px", fontSize: "13px" }}>
                {isMajorProject 
                  ? "You'll be notified once the barangay reviews your capstone project."
                  : "You'll receive 25 tokens once the barangay approves your submission."
                }
              </p>
              
              {/* Token Reward - Only show for Minor projects */}
              {!isMajorProject && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "16px 24px", background: "linear-gradient(135deg, #FFF8F0 0%, #FDE8C8 100%)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(251, 191, 36, 0.2)", border: "1px solid #FDE8C8" }}>
                  <Coins size={48} color="#B45309" strokeWidth={2.5} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "12px", color: "#B45309", fontWeight: "500" }}>Pending Approval</div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#B45309", display: "flex", alignItems: "center", gap: "8px" }}>
                      25 Tokens
                    </div>
                    <div style={{ fontSize: "11px", color: "#92400E", marginTop: "2px" }}>Will be added when LGU approves</div>
                  </div>
                </div>
              )}
              
              {/* Major Project Completion Badge */}
              {isMajorProject && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "16px 24px", background: "linear-gradient(135deg, #5B4FFF 0%, #7C3AED 100%)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(91, 79, 255, 0.4)" }}>
                  <CheckCircle size={48} color="#FFFFFF" strokeWidth={2.5} />
                  <div style={{ textAlign: "left", color: "#FFFFFF" }}>
                    <div style={{ fontSize: "12px", opacity: 0.9, fontWeight: "500" }}>Capstone Completed</div>
                    <div style={{ fontSize: "24px", fontWeight: "700" }}>
                      Academic Requirement Fulfilled
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => navigate("/profile")} style={{ flex: 1, padding: "14px", background: "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                View Profile
              </button>
              <button onClick={() => { setStep(1); setSelectedSubject(""); setUploadedFile(null); setAiQuestions([]); setAnswers([]); setWeaknesses([]); setRemediation(null); }} style={{ flex: 1, padding: "14px", background: "#FFFFFF", color: "#5B4FFF", border: "2px solid #5B4FFF", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Submit Another
              </button>
            </div>
          </div>
        )}

        {/* Custom Alert Modal */}
        {showAlert && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAlert(false)}>
            <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "32px", maxWidth: "400px", width: "90%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", animation: "fadeUp 0.3s ease both" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ width: "48px", height: "48px", background: "#FEE2E2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <AlertCircle size={24} color="#DC2626" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0F172A", textAlign: "center", marginBottom: "12px" }}>Non-Serious Response Detected</h3>
              <p style={{ fontSize: "14px", color: "#64748B", textAlign: "center", lineHeight: "1.6", marginBottom: "24px" }}>Please provide serious, thoughtful answers to the questions. Your responses should demonstrate genuine understanding and effort.</p>
              <button onClick={() => setShowAlert(false)} style={{ width: "100%", padding: "12px 24px", background: "#1A1A1A", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
