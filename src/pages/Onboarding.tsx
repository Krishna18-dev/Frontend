import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, GraduationCap, Target } from "lucide-react";

const LEARNING_GOALS = [
  "Learn to code",
  "Build projects",
  "Career preparation",
  "Academic success",
  "Creative skills",
  "Productivity tools",
  "AI & Technology",
  "Design & UX"
];

const LEARNING_STYLES = [
  { value: "visual", label: "Visual", description: "Videos, diagrams, and demonstrations" },
  { value: "reading", label: "Reading/Writing", description: "Articles, notes, and written content" },
  { value: "interactive", label: "Interactive", description: "Hands-on practice and exercises" },
  { value: "auditory", label: "Auditory", description: "Podcasts and audio content" }
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");
  const [learningStyle, setLearningStyle] = useState("interactive");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedGoals.length === 0) {
      toast.error("Please select at least one learning goal");
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const finalGoals = customGoal 
        ? [...selectedGoals, customGoal]
        : selectedGoals;

      const { error } = await supabase
        .from("profiles")
        .update({
          learning_goals: finalGoals,
          preferences: {
            learning_style: learningStyle,
            experience_level: experienceLevel,
            onboarding_completed: true
          }
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Welcome! Your profile is all set up.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {step === 1 ? (
              <Target className="h-12 w-12 text-primary" />
            ) : step === 2 ? (
              <GraduationCap className="h-12 w-12 text-primary" />
            ) : (
              <Sparkles className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && "What are your learning goals?"}
            {step === 2 && "What's your learning style?"}
            {step === 3 && "What's your experience level?"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Select all that apply. We'll personalize your experience."}
            {step === 2 && "This helps us recommend the best content for you."}
            {step === 3 && "We'll adjust the difficulty of recommendations."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEARNING_GOALS.map((goal) => (
                  <div
                    key={goal}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleGoalToggle(goal)}
                  >
                    <Checkbox
                      checked={selectedGoals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                    />
                    <Label className="cursor-pointer flex-1">{goal}</Label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-goal">Add a custom goal (optional)</Label>
                <Input
                  id="custom-goal"
                  placeholder="e.g., Master Python"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <RadioGroup value={learningStyle} onValueChange={setLearningStyle}>
              <div className="space-y-3">
                {LEARNING_STYLES.map((style) => (
                  <div
                    key={style.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setLearningStyle(style.value)}
                  >
                    <RadioGroupItem value={style.value} id={style.value} />
                    <div className="flex-1">
                      <Label htmlFor={style.value} className="cursor-pointer font-semibold">
                        {style.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {style.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {step === 3 && (
            <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
              <div className="space-y-3">
                <div
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setExperienceLevel("beginner")}
                >
                  <RadioGroupItem value="beginner" id="beginner" />
                  <div className="flex-1">
                    <Label htmlFor="beginner" className="cursor-pointer font-semibold">
                      Beginner
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Just getting started with learning and exploring
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setExperienceLevel("intermediate")}
                >
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <div className="flex-1">
                    <Label htmlFor="intermediate" className="cursor-pointer font-semibold">
                      Intermediate
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Have some experience and ready for more challenges
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setExperienceLevel("advanced")}
                >
                  <RadioGroupItem value="advanced" id="advanced" />
                  <div className="flex-1">
                    <Label htmlFor="advanced" className="cursor-pointer font-semibold">
                      Advanced
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Experienced and looking for advanced topics
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
