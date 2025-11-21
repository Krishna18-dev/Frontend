import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Gamepad2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  type: 'content' | 'interview' | 'game';
  title: string;
  subtitle: string;
  timestamp: string;
  link: string;
}

export const RecentActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const activities: Activity[] = [];

      // Fetch recent saved content
      const { data: content } = await supabase
        .from('saved_content')
        .select('id, content_type, topic, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(2);

      content?.forEach((item) => {
        activities.push({
          id: item.id,
          type: 'content',
          title: item.content_type,
          subtitle: item.topic,
          timestamp: new Date(item.created_at).toLocaleDateString(),
          link: '/study/content'
        });
      });

      // Fetch recent interviews
      const { data: interviews } = await supabase
        .from('interview_sessions')
        .select('id, role, score, completed_at')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(2);

      interviews?.forEach((item) => {
        activities.push({
          id: item.id,
          type: 'interview',
          title: `${item.role} Interview`,
          subtitle: `Score: ${item.score || 'N/A'}`,
          timestamp: new Date(item.completed_at).toLocaleDateString(),
          link: '/study/interview'
        });
      });

      // Fetch recent game progress
      const { data: games } = await supabase
        .from('game_progress')
        .select('id, game_type, score, played_at')
        .eq('user_id', user?.id)
        .order('played_at', { ascending: false })
        .limit(2);

      games?.forEach((item) => {
        activities.push({
          id: item.id,
          type: 'game',
          title: item.game_type,
          subtitle: `Score: ${item.score}`,
          timestamp: new Date(item.played_at).toLocaleDateString(),
          link: '/study/games'
        });
      });

      // Sort by timestamp and take top 5
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'interview':
        return <Briefcase className="h-4 w-4 text-accent" />;
      case 'game':
        return <Gamepad2 className="h-4 w-4 text-success" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-full bg-background">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground">{activity.subtitle} • {activity.timestamp}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(activity.link)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
