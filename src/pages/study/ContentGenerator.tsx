import { FileText, Map, Calendar, Layers, HelpCircle, FileSearch } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const contentTypes = [
  {
    icon: FileText,
    title: "Lecture Notes",
    description: "Generate comprehensive study notes",
    color: "text-blue-500",
  },
  {
    icon: Map,
    title: "Learning Roadmap",
    description: "Create a structured learning path",
    color: "text-blue-500",
  },
  {
    icon: Calendar,
    title: "Study Timetable",
    description: "Build a personalized study schedule",
    color: "text-blue-500",
  },
  {
    icon: Layers,
    title: "Project Outline",
    description: "Plan your project structure",
    color: "text-blue-500",
  },
  {
    icon: HelpCircle,
    title: "Practice MCQs",
    description: "Generate practice questions",
    color: "text-blue-500",
  },
  {
    icon: FileSearch,
    title: "Research Paper",
    description: "Outline and structure your paper",
    color: "text-blue-500",
  },
];

const ContentGenerator = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Generator</h1>
          <p className="text-muted-foreground">Choose what type of content you'd like to generate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => (
            <Card
              key={type.title}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mb-4">
                  <type.icon className={`h-12 w-12 ${type.color}`} />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
