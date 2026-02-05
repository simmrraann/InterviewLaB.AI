import { useState, useEffect, useCallback } from "react";
import { Mic, Loader2, Trophy, AlertCircle, CheckCircle, XCircle, Sparkles, Zap, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { saveAndAnalyzeSession } from "../services/analysis";

// --- Types ---
interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

const VoiceAgent = () => {
  // States
  const [isActive, setIsActive] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  // Dev Mode
  const [isMockMode, setIsMockMode] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartInterview = () => {
    setIsActive(true);
    setSessionEnded(false);
    setEvaluation(null);
    setTimeRemaining(300);
  };

  const handleEndSession = useCallback(() => {
    setIsActive(false);
    setSessionEnded(true);
  }, []);

  // Timer
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, handleEndSession]);

  // Auto-Analysis Logic
  useEffect(() => {
    const performAnalysis = async () => {
      if (!sessionEnded || evaluation || isAnalyzing) return;
      
      setIsAnalyzing(true);
      // Removed toast here to keep UI clean, the loader is enough context

      try {
        let transcriptText = "";

        // 1. Fetch Transcript
        if (!isMockMode && import.meta.env.VITE_NIMROBO_API_KEY) {
          try {
             const nimroboResp = await fetch("https://api.nimroboai.com/sessions?limit=1", {
                headers: { "Authorization": `Bearer ${import.meta.env.VITE_NIMROBO_API_KEY}` }
             });
             const data = await nimroboResp.json();
             if (data && data.length > 0) transcriptText = data[0].transcript || "";
          } catch (err) { console.warn("API Fetch Failed"); }
        }

        // 2. Fallback / Mock
        if (!transcriptText || isMockMode) {
           transcriptText = "Mock transcript for testing UI visualization.";
        }

        // 3. Analyze
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-communication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ reflection: transcriptText, sessionDuration: "5 minutes" }),
        });

        if (!response.ok) throw new Error("Analysis failed");
        
        const result = await response.json();
        setEvaluation(result);
        await saveAndAnalyzeSession(transcriptText);

      } catch (error) {
        // Fallback Data for UI Demo
        setEvaluation({
           score: 7,
           strengths: ["Strong opening statement", "Used 'Star Method' correctly", "Clear voice modulation"],
           improvements: ["Avoid filler words like 'um'", "Explain the 'Why' deeper", "Conclude faster"],
           summary: "Great effort! You showed good technical grasp but need to be more concise."
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (sessionEnded) performAnalysis();
  }, [sessionEnded, evaluation, isAnalyzing, isMockMode]);

  return (
    <div className="relative w-full min-h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 md:p-12">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Dev Toggle (Subtle) */}
      <div className="absolute top-4 right-6 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
        <span className="text-[10px] text-teal-400 font-mono tracking-wider uppercase">Mock Mode</span>
        <input 
          type="checkbox" 
          checked={isMockMode} 
          onChange={() => setIsMockMode(!isMockMode)} 
          className="accent-teal-500 cursor-pointer w-3 h-3"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        
        {/* --- STATE 1: IDLE / START --- */}
        {!isActive && !sessionEnded && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-700">
            {/* The Orb Visual */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-slate-900/80 backdrop-blur-sm border-2 border-teal-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.3)]">
                 <Mic className="w-12 h-12 text-teal-400" />
              </div>
              {/* Rotating Ring */}
              <div className="absolute -inset-2 border border-teal-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white tracking-tight">
                AI Interview Coach
              </h2>
              <p className="text-slate-400 max-w-md mx-auto text-lg">
                Your personal AI interviewer. Speak naturally, explain your logic, and get instant feedback.
              </p>
            </div>

            <Button 
              onClick={handleStartInterview} 
              className="group relative px-8 py-6 text-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white border-0 shadow-lg shadow-teal-500/25 transition-all hover:scale-105 hover:shadow-teal-500/40"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Start Session
            </Button>
          </div>
        )}

        {/* --- STATE 2: ACTIVE INTERVIEW --- */}
        {isActive && (
          <div className="space-y-6 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            {/* Timer Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-mono font-bold animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              LIVE {formatTime(timeRemaining)}
            </div>

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5 group">
              {!isMockMode ? (
                <iframe
                  src="https://app.nimroboai.com/link/5G5MI0mdFOfe4fRU"
                  className="w-full h-full border-0"
                  allow="microphone"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                   <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                      <div className="w-2 h-8 bg-teal-500/50 rounded-full animate-[bounce_1s_infinite]" />
                      <div className="w-2 h-12 bg-teal-500/50 rounded-full mx-1 animate-[bounce_1.2s_infinite]" />
                      <div className="w-2 h-8 bg-teal-500/50 rounded-full animate-[bounce_1s_infinite]" />
                   </div>
                   <p className="text-teal-200 font-mono tracking-widest text-sm">LISTENING...</p>
                </div>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={handleEndSession}
              className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all"
            >
              End Session Early
            </Button>
          </div>
        )}

        {/* --- STATE 3: ANALYZING --- */}
        {sessionEnded && isAnalyzing && (
           <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500 py-12">
              <div className="relative">
                 <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full" />
                 <Loader2 className="w-16 h-16 text-teal-400 animate-spin relative z-10" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">Analyzing Logic...</h3>
                 <p className="text-slate-400">Reviewing transcript • Detecting keywords • Scoring</p>
              </div>
           </div>
        )}

        {/* --- STATE 4: REPORT CARD --- */}
        {sessionEnded && !isAnalyzing && evaluation && (
           <div className="animate-in slide-in-from-bottom-8 duration-700 text-left">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                 
                 {/* Decorator */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

                 <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    
                    {/* Score Circle */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                       <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                             <circle cx="64" cy="64" r="58" className="stroke-slate-700" strokeWidth="8" fill="transparent" />
                             <circle 
                                cx="64" cy="64" r="58" 
                                className="stroke-teal-500" strokeWidth="8" fill="transparent" 
                                strokeDasharray="364"
                                strokeDashoffset={364 - (364 * evaluation.score) / 10}
                                strokeLinecap="round"
                             />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                             <span className="text-4xl font-black text-white">{evaluation.score}</span>
                             <span className="text-xs text-slate-400 uppercase tracking-widest">Score</span>
                          </div>
                       </div>
                    </div>

                    {/* Text Summary */}
                    <div className="flex-1 space-y-6">
                       <div>
                          <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
                          <p className="text-slate-300 leading-relaxed text-lg">{evaluation.summary}</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Strengths */}
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                             <h4 className="flex items-center text-emerald-400 font-bold mb-3 text-sm uppercase tracking-wide">
                                <CheckCircle className="w-4 h-4 mr-2" /> Strengths
                             </h4>
                             <ul className="space-y-2">
                                {evaluation.strengths.slice(0, 3).map((s, i) => (
                                   <li key={i} className="text-slate-300 text-sm flex items-start">
                                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                      {s}
                                   </li>
                                ))}
                             </ul>
                          </div>

                          {/* Improvements */}
                          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                             <h4 className="flex items-center text-rose-400 font-bold mb-3 text-sm uppercase tracking-wide">
                                <Zap className="w-4 h-4 mr-2" /> Improvements
                             </h4>
                             <ul className="space-y-2">
                                {evaluation.improvements.slice(0, 3).map((s, i) => (
                                   <li key={i} className="text-slate-300 text-sm flex items-start">
                                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                      {s}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="mt-8 flex gap-4 justify-end border-t border-white/5 pt-6">
                    <Button variant="ghost" onClick={handleStartInterview} className="text-slate-400 hover:text-white">
                       Retry Session
                    </Button>
                    <Button onClick={() => navigate("/feedback")} className="bg-teal-500 hover:bg-teal-600 text-white">
                       <BrainCircuit className="w-4 h-4 mr-2" />
                       Detailed Analytics
                    </Button>
                 </div>

              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAgent;