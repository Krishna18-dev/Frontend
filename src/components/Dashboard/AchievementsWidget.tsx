import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned_at?: string;
}

export const AchievementsWidget = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          earned_at,
          achievements (
            id,
            name,
            description,
            icon,
            points
          )
        `)
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const formattedAchievements = data?.map((item: any) => ({
        ...item.achievements,
        earned_at: item.earned_at
      })) || [];

      setAchievements(formattedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Trophy,
      Award,
      Star,
    };
    const Icon = icons[iconName] || Award;
    return <Icon className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
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
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  {getIcon(achievement.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  {achievement.points} pts
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-3">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Start learning to earn achievements!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
