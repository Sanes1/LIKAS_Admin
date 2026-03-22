import { useState, useEffect } from "react";
import { Volume2, VolumeX, Settings } from "lucide-react";

export default function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    speechRate: 0.8,
    speechVolume: 1.0,
    highlightText: true
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    
    // Dispatch custom event to notify TextToSpeech components
    window.dispatchEvent(new CustomEvent('accessibilitySettingsChanged', { 
      detail: newSettings 
    }));
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#5B4FFF",
          border: "none",
          color: "#FFFFFF",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(91, 79, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s"
        }}
        title="Accessibility Settings"
      >
        <Settings size={24} strokeWidth={2} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div style={{
          position: "absolute",
          bottom: "70px",
          right: "0",
          width: "300px",
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          padding: "20px",
          animation: "fadeUp 0.2s ease"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Volume2 size={18} />
            Accessibility Settings
          </h3>

          {/* Speech rate setting */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#374151", marginBottom: "8px", display: "block", fontWeight: "600" }}>
              Speech Rate: {settings.speechRate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Volume setting */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#374151", marginBottom: "8px", display: "block", fontWeight: "600" }}>
              Volume: {Math.round(settings.speechVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.speechVolume}
              onChange={(e) => updateSetting('speechVolume', parseFloat(e.target.value))}
            />
          </div>

          {/* Text highlighting setting */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.highlightText}
                onChange={(e) => updateSetting('highlightText', e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px", color: "#374151" }}>Highlight text while reading</span>
            </label>
          </div>

          {/* Test button */}
          <button
            onClick={() => {
              const testUtterance = new SpeechSynthesisUtterance("Testing speech settings. This is how the text-to-speech will sound with your current settings.");
              testUtterance.rate = settings.speechRate;
              testUtterance.volume = settings.speechVolume;
              testUtterance.pitch = 1;
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(testUtterance);
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: "#5B4FFF",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "16px",
              transition: "all 0.2s"
            }}
          >
            Test Settings
          </button>

          {/* Browser support info */}
          <div style={{ padding: "12px", background: "#F3F4F6", borderRadius: "8px", marginTop: "16px" }}>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              {('speechSynthesis' in window) ? (
                <>Text-to-speech is supported in your browser</>
              ) : (
                <>Text-to-speech is not supported in your browser</>
              )}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: #E5E7EB;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #5B4FFF;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #4A3FD9;
          transform: scale(1.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #5B4FFF;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          background: #4A3FD9;
          transform: scale(1.1);
        }
        
        input[type="checkbox"] {
          cursor: pointer;
          accent-color: #5B4FFF;
        }
      `}</style>
    </div>
  );
}