import { Brain, Zap, Gamepad2, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const games = [
  {
    icon: Brain,
    title: "Flashcards",
    description: "Test your knowledge with interactive flashcards",
    color: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Quick Quiz",
    description: "Fast-paced multiple choice questions",
    color: "text-blue-500",
  },
  {
    icon: Gamepad2,
    title: "Match Game",
    description: "Match concepts with their definitions",
    color: "text-blue-500",
  },
  {
    icon: Trophy,
    title: "Concept Builder",
    description: "Build connections between related ideas",
    color: "text-blue-500",
  },
];

const LearningGames = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Learning Games</h1>
          <p className="text-muted-foreground">Master concepts through interactive games and challenges</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Card
              key={game.title}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="p-8">
                <div className="mb-4">
                  <game.icon className={`h-12 w-12 ${game.color}`} />
                </div>
                <CardTitle className="text-2xl">{game.title}</CardTitle>
                <CardDescription className="text-base">{game.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningGames;
