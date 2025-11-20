import { useState } from "react";
import { Briefcase, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Interview = () => {
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const difficultyLevels = [
    { value: "easy", label: "Easy", description: "5 basic questions" },
    { value: "medium", label: "Medium", description: "6 standard questions" },
    { value: "hard", label: "Hard", description: "7 challenging questions" },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Mock Interview</h1>
          <p className="text-muted-foreground">Practice your interview skills with AI-generated questions</p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobRole">Job Role / Position *</Label>
              <Input
                id="jobRole"
                placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Difficulty Level</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficultyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setDifficulty(level.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      difficulty === level.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold mb-1">{level.label}</p>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Interview Tips:</p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Take your time to think before answering</li>
                    <li>• Use specific examples from your experience</li>
                    <li>• Structure answers using the STAR method</li>
                    <li>• Be honest and authentic</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!jobRole.trim()}
            >
              <span className="mr-2">▶</span>
              Start Interview
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
