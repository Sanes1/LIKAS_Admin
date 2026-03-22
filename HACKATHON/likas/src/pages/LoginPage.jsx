import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginStudent, registerStudent } from "../services/authService";
import { Mail, Lock, User, School, IdCard, Eye, EyeOff, X } from "lucide-react";
import likasEmblem from "../assets/likas-emblem.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [lrn, setLrn] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showModal, setShowModal] = useState(null); // 'terms', 'privacy', or 'data'

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.onCaptchaVerify = () => {
      setCaptchaVerified(true);
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setError("");
    setLoading(true);

    const result = await loginStudent(email, password);
    
    if (result.success) {
      const userData = {
        uid: result.user.uid,
        ...result.data
      };
      localStorage.setItem("studentData", JSON.stringify(userData));
      navigate("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    if (!captchaVerified) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setError("");
    setLoading(true);

    const result = await registerStudent(email, password, {
      username,
      lrn,
      school
    });
    
    if (result.success) {
      const loginResult = await loginStudent(email, password);
      if (loginResult.success) {
        const userData = {
          uid: loginResult.user.uid,
          ...loginResult.data
        };
        localStorage.setItem("studentData", JSON.stringify(userData));
        navigate("/");
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setAgreedToTerms(false);
    setCaptchaVerified(false);
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
  };

  const openModal = (type) => {
    setShowModal(type);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  const renderPolicyContent = () => {
    if (showModal === 'terms') {
      return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>Terms of Service</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Last Updated: March 15, 2026</p>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>1. Acceptance of Terms</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              By accessing and using LIKAS ("the Platform"), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>2. Eligibility</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              You must be a currently enrolled student with a valid Learner Reference Number (LRN) to use this Platform. 
              By registering, you confirm that all information provided is accurate and up-to-date.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>3. User Responsibilities</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>As a user of LIKAS, you agree to:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Provide accurate and truthful information in all project submissions</li>
              <li>Complete community projects with integrity and professionalism</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not misuse the token system or attempt to manipulate rewards</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>4. Project Submissions</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              All project submissions must be your original work. Plagiarism or fraudulent submissions will result in 
              account suspension and forfeiture of earned tokens.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>5. Token System</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              Tokens earned through project completion are virtual rewards within the Platform. They have no monetary 
              value and cannot be exchanged for cash.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>6. Contact Information</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              For questions about these Terms of Service, please contact us at support@likas.edu.ph
            </p>
          </section>
        </div>
      );
    }

    if (showModal === 'privacy') {
      return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>Privacy Policy</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Last Updated: March 15, 2026</p>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>1. Information We Collect</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
              When you register for LIKAS, we collect:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Full name</li>
              <li>Email address</li>
              <li>Learner Reference Number (LRN)</li>
              <li>School name</li>
              <li>Project submissions and related files</li>
              <li>Token balance and transaction history</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>2. How We Use Your Information</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>We use your information to:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Create and manage your account</li>
              <li>Process and verify project submissions</li>
              <li>Award and track tokens</li>
              <li>Connect you with community projects</li>
              <li>Improve our services and user experience</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>3. Information Sharing</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
              We may share your information with your school, LGUs, and CHED for academic and project coordination purposes. 
              We will never sell your personal information to third parties.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>4. Data Security</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              We implement industry-standard security measures including encrypted data transmission, secure cloud storage, 
              and regular security audits.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>5. Your Rights</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>You have the right to:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Access your personal information</li>
              <li>Request corrections to your data</li>
              <li>Delete your account and associated data</li>
              <li>Export your project submissions</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>6. Contact Us</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              For privacy-related questions, contact us at privacy@likas.edu.ph
            </p>
          </section>
        </div>
      );
    }

    if (showModal === 'data') {
      return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>Data Policy</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Last Updated: March 15, 2026</p>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>1. Overview</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              This Data Policy explains how LIKAS collects, uses, stores, and shares your data. By using our Platform, 
              you acknowledge and consent to the practices described in this policy.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>2. Data Collection Methods</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>We collect data through:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Information you provide during registration</li>
              <li>Project submissions and uploaded files</li>
              <li>Your interactions with the Platform</li>
              <li>AI-assisted analysis of your project submissions</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>3. Data Storage</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>Your data is stored securely using:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li><strong>Firebase Firestore:</strong> User profiles, project metadata, and token balances</li>
              <li><strong>Firebase Storage:</strong> Uploaded project files and documents</li>
              <li><strong>Firebase Authentication:</strong> Secure login credentials</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>4. Data Usage</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>We use your data to:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Provide personalized educational experiences</li>
              <li>Match you with relevant community projects</li>
              <li>Generate AI-powered insights on your submissions</li>
              <li>Track your progress and achievements</li>
              <li>Improve Platform features and user experience</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>5. Data Sharing with Partners</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
              Your data may be shared with educational institutions, LGUs, and CHED assessors for academic credit verification 
              and project coordination purposes.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>6. Your Control Over Data</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>You can manage your data by:</p>
            <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
              <li>Updating your profile information at any time</li>
              <li>Deleting individual project submissions</li>
              <li>Requesting account deletion</li>
              <li>Downloading your data export</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>7. Contact for Data Requests</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151' }}>
              For data-related requests or questions, contact our Data Protection Officer at data@likas.edu.ph
            </p>
          </section>
        </div>
      );
    }

    return null;
  };

  return (
    <>
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        input:focus { 
          outline: none; 
          border-color: #5B4FFF;
          box-shadow: 0 0 0 3px rgba(91, 79, 255, 0.1);
        }
        
        button:hover:not(:disabled) { 
          opacity: 0.9;
        }
        
        .input-group {
          position: relative;
          margin-bottom: 16px;
        }
        
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #9CA3AF;
        }
        
        .input-with-icon {
          padding-left: 44px !important;
        }
        
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #9CA3AF;
          transition: color 0.2s;
        }
        
        .password-toggle:hover {
          color: #4B5563;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Left Side - Branding */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #5B4FFF 0%, #4A3FD9 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        color: '#FFFFFF',
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden'
      }}>
        {/* Geometric Pattern Background */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', border: '60px solid rgba(255,255,255,0.08)', borderRadius: '20px', transform: 'rotate(15deg)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: '300px', height: '300px', border: '50px solid rgba(255,255,255,0.06)', borderRadius: '20px', transform: 'rotate(25deg)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '350px', height: '350px', border: '55px solid rgba(255,255,255,0.07)', borderRadius: '20px', transform: 'rotate(-20deg)' }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '80px' }}>
            <div style={{ width: '56px', height: '56px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
              <img src={likasEmblem} alt="LIKAS" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>LIKAS</span>
          </div>

          {/* Hero Text */}
          <div>
            <h1 style={{ fontSize: '56px', fontWeight: '700', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Hello<br/>LIKAS!
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.6', opacity: 0.95, maxWidth: '480px' }}>
              Connect with local projects, earn tokens, and complete your academic requirements while making a real difference in your community.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>© 2026 LIKAS. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ 
        width: '480px', 
        background: '#FFFFFF', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '60px 50px',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0F172A', marginBottom: '12px' }}>
              {isLogin ? 'Welcome Back!' : 'LIKAS'}
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B' }}>
              {isLogin ? (
                <>Don't have an account? <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#5B4FFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Create a new account now.</button> It's FREE! Takes less than a minute.</>
              ) : (
                <>Already have an account? <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#5B4FFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Sign in here.</button></>
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#DC2626' }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <>
                <div className="input-group">
                  <div className="input-icon">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Full name"
                    required
                    className="input-with-icon"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <IdCard size={18} />
                  </div>
                  <input
                    type="text"
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    placeholder="LRN (12 digits)"
                    required
                    maxLength="12"
                    className="input-with-icon"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <School size={18} />
                  </div>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="School name"
                    required
                    className="input-with-icon"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="input-with-icon"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s' }}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength="6"
                className="input-with-icon"
                style={{ width: '100%', padding: '12px 14px', paddingRight: '44px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s' }}
              />
              <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* reCAPTCHA */}
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', transform: 'scale(0.95)', transformOrigin: 'center' }}>
              <div 
                className="g-recaptcha" 
                data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                data-callback="onCaptchaVerify"
              ></div>
            </div>

            {!isLogin && (
              <>
                {/* Terms Checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    style={{ marginTop: '3px', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="terms" style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', cursor: 'pointer' }}>
                    I agree to the{' '}
                    <a href="#terms" onClick={(e) => { e.preventDefault(); openModal('terms'); }} style={{ color: '#5B4FFF', textDecoration: 'none' }}>Terms of Service</a>,{' '}
                    <a href="#privacy" onClick={(e) => { e.preventDefault(); openModal('privacy'); }} style={{ color: '#5B4FFF', textDecoration: 'none' }}>Privacy Policy</a>, and{' '}
                    <a href="#data" onClick={(e) => { e.preventDefault(); openModal('data'); }} style={{ color: '#5B4FFF', textDecoration: 'none' }}>Data Policy</a>
                  </label>
                </div>

                {/* Privacy Notice */}
                <div style={{ padding: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.5' }}>
                    By creating an account, you acknowledge that we may use your information to provide and improve our services, including educational content and community features.
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || !captchaVerified || (!isLogin && !agreedToTerms)}
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: (loading || !captchaVerified || (!isLogin && !agreedToTerms)) ? '#D1D5DB' : '#1A1A1A', 
                color: '#FFFFFF', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: (loading || !captchaVerified || (!isLogin && !agreedToTerms)) ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #FFFFFF', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Login Now' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* Modal for Policies */}
    {showModal && (
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={closeModal}
      >
        <div 
          style={{ 
            background: '#FFFFFF', 
            borderRadius: '12px', 
            maxWidth: '900px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{ 
            padding: '24px 32px', 
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {showModal === 'terms' && 'Terms of Service'}
              {showModal === 'privacy' && 'Privacy Policy'}
              {showModal === 'data' && 'Data Policy'}
            </h2>
            <button
              onClick={closeModal}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <X size={24} color="#6B7280" />
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ 
            overflowY: 'auto', 
            flex: 1,
            padding: '0'
          }}>
            {renderPolicyContent()}
          </div>

          {/* Modal Footer */}
          <div style={{ 
            padding: '20px 32px', 
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={closeModal}
              style={{
                padding: '10px 24px',
                background: '#1A1A1A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
