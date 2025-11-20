import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Code, Palette, Zap, CheckCircle2 } from "lucide-react";
import { mockCategories } from "@/lib/mockData";

interface LearningTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed?: boolean;
}

const learningTasks: Record<string, LearningTask[]> = {
  creativity: [
    {
      id: "cr1",
      title: "Create Your First AI Presentation",
      description: "Learn to use Gamma.ai to create stunning presentations in minutes",
      duration: "30 min",
      difficulty: "Beginner",
    },
    {
      id: "cr2",
      title: "Generate Original Music",
      description: "Use Suno.ai to create background music for your projects",
      duration: "45 min",
      difficulty: "Beginner",
    },
    {
      id: "cr3",
      title: "Design Social Media Graphics",
      description: "Master Canva AI for creating eye-catching social media content",
      duration: "1 hour",
      difficulty: "Intermediate",
    },
  ],
  productivity: [
    {
      id: "pr1",
      title: "AI-Powered Note Taking",
      description: "Learn to use AI tools for efficient note-taking and organization",
      duration: "25 min",
      difficulty: "Beginner",
    },
    {
      id: "pr2",
      title: "Automate Your Workflow",
      description: "Set up AI assistants to handle repetitive tasks",
      duration: "50 min",
      difficulty: "Intermediate",
    },
    {
      id: "pr3",
      title: "Research with AI",
      description: "Master ChatGPT for efficient research and learning",
      duration: "40 min",
      difficulty: "Beginner",
    },
  ],
  coding: [
    {
      id: "co1",
      title: "Code with AI Assistance",
      description: "Get started with Cursor and AI-powered coding",
      duration: "1 hour",
      difficulty: "Beginner",
    },
    {
      id: "co2",
      title: "Build Your First Web App",
      description: "Create a simple web application with AI help",
      duration: "2 hours",
      difficulty: "Intermediate",
    },
    {
      id: "co3",
      title: "Debug Like a Pro",
      description: "Learn to use AI for debugging and code optimization",
      duration: "45 min",
      difficulty: "Intermediate",
    },
  ],
};

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState("creativity");

  const categoryIcons: Record<string, any> = {
    creativity: Palette,
    productivity: Zap,
    coding: Code,
    communication: BookOpen,
    research: GraduationCap,
  };

  const currentTasks = learningTasks[selectedCategory] || [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Skill-Building{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow guided learning paths and build real projects with AI tools.
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mockCategories.map((category) => {
              const Icon = categoryIcons[category.id] || BookOpen;
              const isSelected = selectedCategory === category.id;
              return (
                <Card
                  key={category.id}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected ? "ring-2 ring-primary shadow-md" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-center space-y-3">
                    <div
                      className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? "bg-primary" : "bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected ? "text-white" : "text-primary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Learning Tasks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            <Badge variant="secondary">
              {currentTasks.length} {currentTasks.length === 1 ? "Task" : "Tasks"}
            </Badge>
          </div>

          <div className="grid gap-6">
            {currentTasks.map((task, index) => (
              <Card
                key={task.id}
                className="p-6 hover:shadow-lg transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Task Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-muted-foreground">{task.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{task.duration}</Badge>
                      <Badge
                        variant={
                          task.difficulty === "Beginner"
                            ? "secondary"
                            : task.difficulty === "Intermediate"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {task.difficulty}
                      </Badge>
                      {task.completed && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:items-end justify-center">
                    <Button variant="gradient" className="w-full md:w-auto">
                      Start Learning
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full md:w-auto">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Quick Start Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Project Brief Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Ready-to-use template for planning your projects
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Download
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Presentation Starter</h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful slide templates for your presentations
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Download
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary-glow/10 flex items-center justify-center">
                  <Code className="h-6 w-6 text-primary-glow" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Code Snippets</h3>
                  <p className="text-sm text-muted-foreground">
                    Useful code snippets and examples to get started
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Download
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
