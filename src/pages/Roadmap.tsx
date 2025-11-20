import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Target, Calendar, TrendingUp, BookOpen, Award, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Milestone {
  month: number;
  title: string;
  description: string;
  topics: string[];
  projects: string[];
  resources: string[];
  outcome: string;
}

interface Roadmap {
  title: string;
  overview: string;
  totalDuration: string;
  milestones: Milestone[];
  weeklySchedule: {
    hoursPerWeek: number;
    breakdown: {
      theory: string;
      practice: string;
      projects: string;
    };
  };
  skills: string[];
  careerPaths: string[];
}

const Roadmap = () => {
  const [goal, setGoal] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [timeframe, setTimeframe] = useState("6");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal.trim() || !currentLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your roadmap.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setRoadmap(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-roadmap", {
        body: { goal, currentLevel, timeframe: parseInt(timeframe) },
      });

      if (error) throw error;

      if (data?.roadmap) {
        setRoadmap(data.roadmap);
        toast({
          title: "Roadmap Generated!",
          description: "Your personalized learning path is ready.",
        });
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Target className="h-4 w-4" />
            <span>AI Learning Roadmap</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Your Personalized{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Learning Path
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get a structured, milestone-based roadmap tailored to your goals, current level, and timeline
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 mb-8 shadow-lg">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal">What do you want to learn?</Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="E.g., Master full-stack web development, Learn data science and machine learning, Become proficient in digital marketing..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentLevel">Current Experience Level</Label>
                <Select value={currentLevel} onValueChange={setCurrentLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete-beginner">Complete Beginner</SelectItem>
                    <SelectItem value="beginner">Beginner (Some basics)</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Learning Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months (Intensive)</SelectItem>
                    <SelectItem value="6">6 Months (Balanced)</SelectItem>
                    <SelectItem value="9">9 Months (Comprehensive)</SelectItem>
                    <SelectItem value="12">12 Months (In-depth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full"
              variant="gradient"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating Your Roadmap...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Generate My Learning Roadmap
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Roadmap Display */}
        {roadmap && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-3">{roadmap.title}</h2>
              <p className="text-muted-foreground mb-4">{roadmap.overview}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{roadmap.totalDuration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-glow/10">
                    <BookOpen className="h-5 w-5 text-primary-glow" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Commitment</p>
                    <p className="font-semibold">{roadmap.weeklySchedule.hoursPerWeek} hours/week</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Milestones</p>
                    <p className="font-semibold">{roadmap.milestones.length} phases</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Weekly Schedule */}
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Study Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {roadmap.weeklySchedule.breakdown.theory}
                  </div>
                  <p className="text-sm text-muted-foreground">Theory & Concepts</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-glow mb-1">
                    {roadmap.weeklySchedule.breakdown.practice}
                  </div>
                  <p className="text-sm text-muted-foreground">Hands-on Practice</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {roadmap.weeklySchedule.breakdown.projects}
                  </div>
                  <p className="text-sm text-muted-foreground">Projects & Portfolio</p>
                </div>
              </div>
            </Card>

            {/* Milestones */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Your Learning Journey
              </h3>

              {roadmap.milestones.map((milestone, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {milestone.month}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-xl font-bold mb-1">{milestone.title}</h4>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Topics to Learn
                          </h5>
                          <ul className="space-y-1">
                            {milestone.topics.map((topic, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary-glow" />
                            Hands-on Projects
                          </h5>
                          <ul className="space-y-1">
                            {milestone.projects.map((project, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {milestone.resources.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2">Recommended Resources</h5>
                          <div className="flex flex-wrap gap-2">
                            {milestone.resources.map((resource, i) => (
                              <Badge key={i} variant="secondary">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-border/40">
                        <p className="text-sm">
                          <span className="font-semibold">Outcome:</span>{" "}
                          <span className="text-muted-foreground">{milestone.outcome}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Skills & Career Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Skills You'll Gain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skills.map((skill, i) => (
                    <Badge key={i} variant="default" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-glow" />
                  Career Opportunities
                </h3>
                <div className="space-y-2">
                  {roadmap.careerPaths.map((path, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary-glow" />
                      <span className="text-sm">{path}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Ready to Start Your Journey?</h3>
                <p className="text-muted-foreground">
                  Save this roadmap and track your progress through your dashboard
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="gradient" size="lg">
                    Save to Dashboard
                  </Button>
                  <Button variant="outline" size="lg">
                    Share Roadmap
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
