import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Bookmark,
  Calendar,
  Trophy,
  Clock,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { mockSavedWorks, mockUserProfile } from "@/lib/mockData";

const Dashboard = () => {
  const savedWorks = mockSavedWorks;
  const profile = mockUserProfile;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>
          <p className="text-muted-foreground">
            Here's your learning progress and saved work
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{savedWorks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Bookmark className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Skills Learned</p>
                <p className="text-3xl font-bold">{profile.skills.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary-glow/10">
                <TrendingUp className="h-6 w-6 text-primary-glow" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Learning Streak</p>
                <p className="text-3xl font-bold">7 days</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Badges Earned</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Work */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Saved Work</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {savedWorks.map((work, index) => (
                <Card
                  key={work.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{work.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last modified: {formatDate(work.metadata.lastModified)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {work.tool}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{work.progress}%</span>
                      </div>
                      <Progress value={work.progress} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="gradient" size="sm" className="flex-1">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {savedWorks.length === 0 && (
                <Card className="p-12 text-center">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">No saved work yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start creating projects with AI tools
                  </p>
                  <Button variant="gradient">Explore Tools</Button>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Your Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Goals */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Goals
              </h3>
              <ul className="space-y-3">
                {profile.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* AI Weekly Suggestions */}
            <Card className="p-6 bg-gradient-primary text-white">
              <h3 className="font-semibold mb-2">AI Weekly Suggestions</h3>
              <p className="text-sm opacity-90 mb-4">
                Based on your learning path, we recommend trying out video editing
                with InVideo.ai this week!
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Get Started
              </Button>
            </Card>

            {/* Badges */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Recent Badges
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    🎉
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">First Presentation</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    🔥
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">7 Day Streak</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
