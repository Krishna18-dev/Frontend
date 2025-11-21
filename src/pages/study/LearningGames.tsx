import { useState } from "react";
import { Brain, Zap, Gamepad2, Trophy, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const games = [
  {
    id: "flashcards",
    icon: Brain,
    title: "Flashcards",
    description: "Test your knowledge with interactive flashcards",
    color: "text-primary",
  },
  {
    id: "quiz",
    icon: Zap,
    title: "Quick Quiz",
    description: "Fast-paced multiple choice questions",
    color: "text-success",
  },
  {
    id: "match",
    icon: Gamepad2,
    title: "Match Game",
    description: "Match concepts with their definitions",
    color: "text-accent",
  },
  {
    id: "concept",
    icon: Trophy,
    title: "Concept Builder",
    description: "Build connections between related ideas",
    color: "text-primary",
  },
];

// Sample flashcards data
const sampleFlashcards = [
  { front: "What is React?", back: "A JavaScript library for building user interfaces" },
  { front: "What is a Component?", back: "A reusable piece of UI that can accept props and maintain state" },
  { front: "What are Props?", back: "Properties passed from parent to child components" },
  { front: "What is State?", back: "Data that changes over time within a component" },
  { front: "What is JSX?", back: "JavaScript XML - syntax extension for JavaScript" },
];

// Sample quiz data
const sampleQuiz = [
  {
    question: "What hook is used for side effects?",
    options: ["useState", "useEffect", "useContext", "useRef"],
    correct: 1,
  },
  {
    question: "Which method renders a React component?",
    options: ["render()", "ReactDOM.render()", "component.render()", "React.render()"],
    correct: 1,
  },
  {
    question: "What does the key prop do?",
    options: ["Locks components", "Helps React identify items", "Encrypts data", "Nothing"],
    correct: 1,
  },
];

const LearningGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  
  // Flashcards state
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setCurrentCard(0);
    setIsFlipped(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
  };

  const closeGame = () => {
    setSelectedGame(null);
    setGameStarted(false);
    setCustomTopic("");
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCard < sampleFlashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      toast.success("You've completed all flashcards!");
      closeGame();
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === sampleQuiz[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const renderFlashcardsGame = () => {
    const card = sampleFlashcards[currentCard];
    const progress = ((currentCard + 1) / sampleFlashcards.length) * 100;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Card {currentCard + 1} of {sampleFlashcards.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <motion.div
          className="perspective-1000"
          onClick={handleFlipCard}
        >
          <motion.div
            className="relative w-full h-64 cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-primary/5">
              <p className="text-2xl font-semibold text-center">{card.front}</p>
            </Card>
            <Card
              className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-success/5"
              style={{ transform: "rotateY(180deg)" }}
            >
              <p className="text-xl text-center">{card.back}</p>
            </Card>
          </motion.div>
        </motion.div>

        <p className="text-sm text-muted-foreground text-center">Click card to flip</p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevCard}
            disabled={currentCard === 0}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNextCard} className="flex-1">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderQuizGame = () => {
    if (quizComplete) {
      const percentage = (score / sampleQuiz.length) * 100;
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Trophy className="h-20 w-20 text-primary mx-auto mb-4" />
          </motion.div>
          <h3 className="text-3xl font-bold">Quiz Complete!</h3>
          <p className="text-4xl font-bold text-primary">
            {score} / {sampleQuiz.length}
          </p>
          <p className="text-xl text-muted-foreground">
            {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={closeGame} className="flex-1">
              Close
            </Button>
            <Button onClick={startGame} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    const question = sampleQuiz[currentQuestion];
    const progress = ((currentQuestion + 1) / sampleQuiz.length) * 100;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {sampleQuiz.length}
            </span>
            <span className="text-sm font-medium">Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold">{question.question}</h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  disabled={selectedAnswer !== null}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === null
                      ? "border-border hover:border-primary"
                      : selectedAnswer === index
                      ? index === question.correct
                        ? "border-success bg-success/10"
                        : "border-destructive bg-destructive/10"
                      : index === question.correct
                      ? "border-success bg-success/10"
                      : "border-border opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer !== null && index === question.correct && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                    {selectedAnswer === index && index !== question.correct && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestion < sampleQuiz.length - 1 ? "Next Question" : "See Results"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const selectedGameData = games.find((g) => g.id === selectedGame);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-4">
            <Gamepad2 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Learning Games</h1>
          <p className="text-muted-foreground">Master concepts through interactive games and challenges</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                onClick={() => setSelectedGame(game.id)}
              >
                <CardHeader className="p-8">
                  <div className="mb-4">
                    <game.icon className={`h-12 w-12 ${game.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{game.title}</CardTitle>
                  <CardDescription className="text-base">{game.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedGame} onOpenChange={closeGame}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedGameData && <selectedGameData.icon className="h-5 w-5" />}
                {selectedGameData?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedGameData?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4">
              {!gameStarted ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic (Optional - using sample data for demo)</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., React Basics, JavaScript ES6, Python Functions"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Note: Currently using sample {selectedGame === "flashcards" ? "flashcards" : "quiz"} data
                    </p>
                  </div>

                  <Button onClick={startGame} className="w-full" size="lg">
                    Start Game
                  </Button>
                </div>
              ) : (
                <>
                  {selectedGame === "flashcards" && renderFlashcardsGame()}
                  {selectedGame === "quiz" && renderQuizGame()}
                  {selectedGame === "match" && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Match game coming soon!</p>
                    </div>
                  )}
                  {selectedGame === "concept" && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Concept builder coming soon!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LearningGames;
