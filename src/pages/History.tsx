import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setSessions(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-20 text-center text-white">Loading your journey...</div>;

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Your Interview Journey</h1>
        
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No sessions yet. Start your first interview!</p>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="bg-card/50 border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate('/feedback')} 
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Technical Mock Session</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Score</p>
                      <p className="text-xl font-bold text-teal-400">{session.score_out_of_10}/10</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;