import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, BookOpen } from "lucide-react";

interface StatData {
  date: string;
  study_time_minutes: number;
  courses_completed: number;
}

export const StatisticsChart = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    if (user) {
      fetchStatistics();
    }
  }, [user]);

  const fetchStatistics = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('user_statistics')
        .select('date, study_time_minutes, courses_completed')
        .eq('user_id', user?.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedData = data?.map((item) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        study_time_minutes: item.study_time_minutes || 0,
        courses_completed: item.courses_completed || 0,
      })) || [];

      setStats(formattedData);
      
      const total = data?.reduce((acc, curr) => acc + (curr.study_time_minutes || 0), 0) || 0;
      const courses = data?.reduce((acc, curr) => acc + (curr.courses_completed || 0), 0) || 0;
      setTotalTime(total);
      setTotalCourses(courses);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading statistics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Statistics (Last 30 Days)</CardTitle>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-semibold">{totalTime} min</span>
            <span className="text-muted-foreground">total study time</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-success" />
            <span className="font-semibold">{totalCourses}</span>
            <span className="text-muted-foreground">courses completed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="study_time_minutes" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Study Time (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No study data yet</p>
              <p className="text-sm text-muted-foreground">Start learning to see your progress!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
