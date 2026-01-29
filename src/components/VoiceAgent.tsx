import { useState, useEffect, useCallback } from "react";
import { Mic, Download, Loader2, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { saveAndAnalyzeSession } from "../services/analysis";

interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

const VoiceAgent = () => {
  const [isActive, setIsActive] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [reflection, setReflection] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isMockMode, setIsMockMode] = useState(false); // 🔥 DEV TOGGLE FOR CREDITS
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
    setTimeRemaining(300);
    setReflection("");
    setEvaluation(null);
  };

  const handleEndSession = useCallback(() => {
    setIsActive(false);
    setSessionEnded(true);
  }, []);

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

  const handleSubmitReflection = async () => {
    if (!reflection.trim()) {
      toast({ title: "Reflection Required", variant: "destructive" });
      return;
    }
    setIsEvaluating(true);

    try {
      if (isMockMode) {
        // 🔥 Mock Mode: Save pre-set data to Supabase without calling Edge Function
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating delay
        await saveAndAnalyzeSession("This is a mock transcript for LinkedIn Demo.");
      } else {
        // Real logic calling your Supabase Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-communication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ reflection, sessionDuration: "5 minutes" }),
        });
        const result = await response.json();
        setEvaluation(result);
      }
      
      toast({ title: "Analysis Complete!" });
      navigate("/feedback"); // Go to your Radar Chart page!
    } catch (error) {
      toast({ title: "Evaluation Failed", variant: "destructive" });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="voice-container p-8 md:p-12 glow-primary relative overflow-hidden">
      {/* Dev Mode Toggle - Hide this for your final recording! */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/80 p-2 rounded-md border border-slate-700">
        <span className="text-[10px] text-slate-400 font-mono">DEV_MOCK_MODE</span>
        <input 
          type="checkbox" 
          checked={isMockMode} 
          onChange={() => setIsMockMode(!isMockMode)} 
          className="accent-teal-500"
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-8">
        {isActive ? (
          <>
            <div className="text-2xl font-mono font-bold text-teal-400 animate-pulse">
              {formatTime(timeRemaining)}
            </div>

            <div className="w-full aspect-video rounded-lg overflow-hidden border border-teal-500/30 shadow-2xl">
              {!isMockMode ? (
                <iframe
                  src="https://app.nimroboai.com/link/5G5MI0mdFOfe4fRU"
                  className="w-full h-full border-0"
                  allow="microphone"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <p className="text-slate-500 font-mono">MOCK_SESSION_ACTIVE (Credits Saved)</p>
                </div>
              )}
            </div>

            <Button variant="outline" size="lg" onClick={handleEndSession} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              End Session
            </Button>
          </>
        ) : sessionEnded ? (
          <div className="w-full space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Session Reflection</h3>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn about your DS & AI logic today?"
              className="min-h-[150px] bg-slate-900/50 border-teal-500/20 focus:border-teal-500"
            />
            <Button variant="hero" size="lg" onClick={handleSubmitReflection} disabled={isEvaluating} className="w-full py-6 text-lg">
              {isEvaluating ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2 h-5 w-5" />}
              Generate Logic Analysis
            </Button>
          </div>
        ) : (
          <>
            {/* 🔥 This uses your .ai-pulse-ring CSS from index.css */}
            <div className="ai-pulse-ring">
              <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-teal-500/50 bg-slate-900">
                <Mic className="w-12 h-12 text-teal-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">InterviewLaB.AI</h2>
              <p className="text-slate-400 max-w-sm">
                Ready for your 5-minute technical drill? 
                Speak your logic out loud.
              </p>
            </div>

            <Button variant="hero" size="xl" onClick={handleStartInterview} className="px-12 py-8 text-xl shadow-[0_0_20px_rgba(45,212,191,0.4)]">
              Start Practice Session
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceAgent;