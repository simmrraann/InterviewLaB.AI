import { supabase } from '../supabaseClient'; // This is the file we made earlier

export const saveAndAnalyzeSession = async (transcript: string) => {
  // 1. In a real project, you'd send 'transcript' to an LLM here.
  // For now, let's pretend the AI gave us this:
  const mockAnalysis = {
    strengths: ["Clear voice", "Good logic", "Confident"],
    weaknesses: ["Too many 'umms'", "Needs more detail on DS", "Fast talking"],
    improvement_areas: "Practice explaining Big O notation slowly.",
    score_out_of_10: 8
  };

  // 2. Save everything to Supabase
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert([{ 
        transcript, 
        ...mockAnalysis,
        status: 'analyzed' 
    }]);

  if (error) console.error("Error saving to Supabase:", error.message);
  return data;
};