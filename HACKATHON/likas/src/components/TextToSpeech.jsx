import { useState, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

export default function TextToSpeech({ text, className = "", buttonStyle = {} }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [highlightedText, setHighlightedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [settings, setSettings] = useState({
    speechRate: 0.8,
    speechVolume: 1.0,
    highlightText: true
  });

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported('speechSynthesis' in window);
    
    // Load accessibility settings
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (text && isSupported) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings from accessibility preferences
      newUtterance.rate = settings.speechRate || 0.8;
      newUtterance.pitch = 1;
      newUtterance.volume = settings.speechVolume || 1.0;
      
      // Event handlers
      newUtterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentWordIndex(0);
      };
      
      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        setHighlightedText("");
      };
      
      newUtterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        setHighlightedText("");
      };

      // Word boundary event for highlighting
      if (settings.highlightText) {
        newUtterance.onboundary = (event) => {
          if (event.name === 'word') {
            const words = text.split(/\s+/);
            const charIndex = event.charIndex;
            let currentIndex = 0;
            let wordIndex = 0;
            
            for (let i = 0; i < words.length; i++) {
              if (currentIndex >= charIndex) {
                wordIndex = i;
                break;
              }
              currentIndex += words[i].length + 1; // +1 for space
            }
            
            setCurrentWordIndex(wordIndex);
            setHighlightedText(words[wordIndex]);
          }
        };
      }
      
      setUtterance(newUtterance);
    }
  }, [text, isSupported, settings]);

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsChange = (event) => {
      if (event.detail) {
        setSettings(event.detail);
      } else {
        // Fallback for storage events from other tabs
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
    };

    window.addEventListener('accessibilitySettingsChanged', handleSettingsChange);
    window.addEventListener('storage', handleSettingsChange);
    
    return () => {
      window.removeEventListener('accessibilitySettingsChanged', handleSettingsChange);
      window.removeEventListener('storage', handleSettingsChange);
    };
  }, []);

  const handlePlay = () => {
    if (!isSupported || !utterance) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      window.speechSynthesis.cancel(); // Stop any current speech
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    if (!isSupported) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setHighlightedText("");
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  const defaultButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    background: "#F5F3FF",
    border: "1px solid #DDD6FE",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#5B4FFF",
    cursor: "pointer",
    transition: "all 0.2s",
    ...buttonStyle
  };

  return (
    <div className={className}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
      
      {/* Show currently highlighted word when playing */}
      {isPlaying && settings.highlightText && highlightedText && (
        <div style={{
          display: "inline-block",
          padding: "4px 8px",
          background: "#FEF3C7",
          border: "1px solid #FDE68A",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#92400E",
          marginBottom: "8px",
          animation: "pulse 0.3s ease"
        }}>
          {highlightedText}
        </div>
      )}
      
      {!isPlaying && !isPaused && (
        <button
          onClick={handlePlay}
          style={defaultButtonStyle}
          title="Read text aloud - Click to start reading"
          aria-label="Read text aloud"
        >
          <Volume2 size={14} strokeWidth={2} />
          Read Aloud
        </button>
      )}
      
      {isPlaying && (
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={handlePause}
            style={defaultButtonStyle}
            title="Pause reading"
            aria-label="Pause reading"
          >
            <Pause size={14} strokeWidth={2} />
            Pause
          </button>
          <button
            onClick={handleStop}
            style={{
              ...defaultButtonStyle,
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              color: "#DC2626"
            }}
            title="Stop reading"
            aria-label="Stop reading"
          >
            <VolumeX size={14} strokeWidth={2} />
            Stop
          </button>
        </div>
      )}
      
      {isPaused && (
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={handlePlay}
            style={defaultButtonStyle}
            title="Resume reading"
            aria-label="Resume reading"
          >
            <Play size={14} strokeWidth={2} />
            Resume
          </button>
          <button
            onClick={handleStop}
            style={{
              ...defaultButtonStyle,
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              color: "#DC2626"
            }}
            title="Stop reading"
            aria-label="Stop reading"
          >
            <VolumeX size={14} strokeWidth={2} />
            Stop
          </button>
        </div>
      )}
    </div>
  );
}