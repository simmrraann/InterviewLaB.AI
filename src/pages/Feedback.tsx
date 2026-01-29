import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export const FeedbackPage = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchLatestFeedback = async () => {
      const { data } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setReport(data);
    };
    fetchLatestFeedback();
  }, []);

  if (!report) return <div className="flex h-screen items-center justify-center text-white">Loading Analysis...</div>;

  // Data for the Radar Chart
  const chartData = [
    { subject: 'Logic', A: report.score_out_of_10 * 10 },
    { subject: 'Communication', A: 85 }, 
    { subject: 'Confidence', A: 90 },
    { subject: 'Clarity', A: 70 },
    { subject: 'Technical', A: report.score_out_of_10 * 8 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold text-teal-400">Interview Performance: {report.score_out_of_10}/10</h1>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Visual Radar Chart */}
          <div className="h-[300px] rounded-xl bg-slate-900/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar name="Performance" dataKey="A" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <h3 className="mb-2 font-bold text-green-400">Strengths</h3>
              <ul className="space-y-1">
                {report.strengths.map((s: string) => <li key={s} className="text-sm">✅ {s}</li>)}
              </ul>
            </div>
            
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <h3 className="mb-2 font-bold text-red-400">Areas to Improve</h3>
              <ul className="space-y-1">
                {report.weaknesses.map((w: string) => <li key={w} className="text-sm">❌ {w}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};