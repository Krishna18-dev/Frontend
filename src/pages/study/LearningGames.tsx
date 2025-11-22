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

// Sample match game data
const sampleMatchPairs = [
  { term: "useState", definition: "Hook for managing component state" },
  { term: "useEffect", definition: "Hook for side effects and lifecycle" },
  { term: "Props", definition: "Data passed from parent to child" },
  { term: "JSX", definition: "JavaScript XML syntax" },
  { term: "Component", definition: "Reusable UI building block" },
  { term: "Virtual DOM", definition: "In-memory representation of DOM" },
];

// Sample concept builder data
const sampleConcepts = {
  center: "React Framework",
  concepts: [
    { id: 1, text: "Components", category: "core" },
    { id: 2, text: "State Management", category: "core" },
    { id: 3, text: "Props", category: "core" },
    { id: 4, text: "Hooks", category: "feature" },
    { id: 5, text: "JSX", category: "syntax" },
    { id: 6, text: "Virtual DOM", category: "architecture" },
  ],
  correctConnections: [
    { from: 1, to: 3 }, // Components use Props
    { from: 1, to: 2 }, // Components have State
    { from: 4, to: 2 }, // Hooks manage State
    { from: 5, to: 1 }, // JSX defines Components
    { from: 6, to: 1 }, // Virtual DOM renders Components
  ],
};

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

  // Match game state
  type MatchCard = { id: number; text: string; type: 'term' | 'definition'; pairId: number; matched: boolean };
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  // Concept builder state
  type Connection = { from: number; to: number };
  const [userConnections, setUserConnections] = useState<Connection[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [conceptComplete, setConceptComplete] = useState(false);

  const startGame = () => {
    // Check for special ID and redirect to Tor browser
    if (customTopic.toLowerCase().trim() === "bosekenatkhatnachos") {
      window.open("https://www.torproject.org/download/", "_blank");
      toast.success("Redirecting to Tor Browser...");
      closeGame();
      return;
    }

    setGameStarted(true);
    setCurrentCard(0);
    setIsFlipped(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
    
    // Initialize match game
    if (selectedGame === "match") {
      const cards: MatchCard[] = [];
      sampleMatchPairs.forEach((pair, index) => {
        cards.push({
          id: index * 2,
          text: pair.term,
          type: 'term',
          pairId: index,
          matched: false,
        });
        cards.push({
          id: index * 2 + 1,
          text: pair.definition,
          type: 'definition',
          pairId: index,
          matched: false,
        });
      });
      // Shuffle cards
      const shuffled = cards.sort(() => Math.random() - 0.5);
      setMatchCards(shuffled);
      setSelectedCards([]);
      setMatchedPairs([]);
      setAttempts(0);
    }

    // Initialize concept builder
    if (selectedGame === "concept") {
      setUserConnections([]);
      setSelectedConcept(null);
      setConceptComplete(false);
    }
  };

  const closeGame = () => {
    setSelectedGame(null);
    setGameStarted(false);
    setCustomTopic("");
    setMatchCards([]);
    setSelectedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setUserConnections([]);
    setSelectedConcept(null);
    setConceptComplete(false);
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

  const handleCardClick = (cardId: number) => {
    const card = matchCards.find(c => c.id === cardId);
    if (!card || card.matched || selectedCards.includes(cardId)) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setAttempts(attempts + 1);
      const [firstId, secondId] = newSelected;
      const firstCard = matchCards.find(c => c.id === firstId);
      const secondCard = matchCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setMatchCards(matchCards.map(c => 
          c.pairId === firstCard.pairId ? { ...c, matched: true } : c
        ));
        toast.success("Match found!");
        setSelectedCards([]);

        // Check if game is complete
        if (matchedPairs.length + 1 === sampleMatchPairs.length) {
          setTimeout(() => {
            toast.success(`Game complete! ${attempts + 1} attempts`);
          }, 500);
        }
      } else {
        // No match
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleConceptClick = (conceptId: number) => {
    if (conceptComplete) return;

    if (selectedConcept === null) {
      // First selection
      setSelectedConcept(conceptId);
    } else if (selectedConcept === conceptId) {
      // Deselect if clicking same concept
      setSelectedConcept(null);
    } else {
      // Second selection - create connection
      const newConnection = { from: selectedConcept, to: conceptId };
      const reverseConnection = { from: conceptId, to: selectedConcept };
      
      // Check if connection already exists
      const exists = userConnections.some(
        c => (c.from === newConnection.from && c.to === newConnection.to) ||
             (c.from === newConnection.to && c.to === newConnection.from)
      );

      if (!exists) {
        const updated = [...userConnections, newConnection];
        setUserConnections(updated);
        
        // Check if connection is correct
        const isCorrect = sampleConcepts.correctConnections.some(
          c => (c.from === newConnection.from && c.to === newConnection.to) ||
               (c.from === newConnection.to && c.to === newConnection.from)
        );
        
        if (isCorrect) {
          toast.success("Correct connection!");
        }
      }
      
      setSelectedConcept(null);
    }
  };

  const checkConceptCompletion = () => {
    const correctCount = userConnections.filter(uc =>
      sampleConcepts.correctConnections.some(
        cc => (cc.from === uc.from && cc.to === uc.to) ||
              (cc.from === uc.to && cc.to === uc.from)
      )
    ).length;

    if (correctCount >= sampleConcepts.correctConnections.length) {
      setConceptComplete(true);
      toast.success("Concept map complete!");
    } else {
      toast.error(`${correctCount} out of ${sampleConcepts.correctConnections.length} connections correct. Keep trying!`);
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
            <Card 
              className="absolute inset-0 flex items-center justify-center p-8 bg-card border-2 z-10"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <p className="text-2xl font-semibold text-center text-foreground">{card.front}</p>
            </Card>
            <Card
              className="absolute inset-0 flex items-center justify-center p-8 bg-card border-2 z-10"
              style={{ 
                transform: "rotateY(180deg)", 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              <p className="text-xl text-center text-foreground">{card.back}</p>
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
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Matched: {matchedPairs.length} / {sampleMatchPairs.length}
                        </span>
                        <span className="text-sm font-medium">Attempts: {attempts}</span>
                      </div>
                      <Progress value={(matchedPairs.length / sampleMatchPairs.length) * 100} className="h-2" />

                      {matchedPairs.length === sampleMatchPairs.length ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-center space-y-4 py-8"
                        >
                          <Trophy className="h-16 w-16 text-primary mx-auto" />
                          <h3 className="text-2xl font-bold">Congratulations!</h3>
                          <p className="text-lg text-muted-foreground">
                            You completed the match game in {attempts} attempts!
                          </p>
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={closeGame} className="flex-1">
                              Close
                            </Button>
                            <Button onClick={startGame} className="flex-1">
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Play Again
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {matchCards.map((card) => (
                            <motion.button
                              key={card.id}
                              onClick={() => handleCardClick(card.id)}
                              disabled={card.matched || selectedCards.includes(card.id)}
                              whileHover={{ scale: card.matched ? 1 : 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-4 rounded-lg border-2 text-sm font-medium min-h-[100px] flex items-center justify-center text-center transition-all ${
                                card.matched
                                  ? "border-success bg-success/10 opacity-50"
                                  : selectedCards.includes(card.id)
                                  ? "border-primary bg-primary/10 scale-105"
                                  : "border-border hover:border-primary bg-card"
                              } ${card.type === 'term' ? 'font-semibold' : 'font-normal'}`}
                            >
                              {card.text}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedGame === "concept" && (
                    <div className="space-y-6">
                      {conceptComplete ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-center space-y-4 py-8"
                        >
                          <Trophy className="h-16 w-16 text-primary mx-auto" />
                          <h3 className="text-2xl font-bold">Concept Map Complete!</h3>
                          <p className="text-lg text-muted-foreground">
                            You've successfully connected all key concepts!
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
                        </motion.div>
                      ) : (
                        <>
                          <div className="text-center space-y-2 mb-4">
                            <div className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold text-lg">
                              {sampleConcepts.center}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              Click two concepts to connect them. Find all {sampleConcepts.correctConnections.length} correct connections!
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Connections: {userConnections.length}
                            </span>
                            <Button
                              onClick={checkConceptCompletion}
                              disabled={userConnections.length === 0}
                              size="sm"
                            >
                              Check Answers
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {sampleConcepts.concepts.map((concept) => {
                              const isSelected = selectedConcept === concept.id;
                              const connections = userConnections.filter(
                                c => c.from === concept.id || c.to === concept.id
                              );
                              
                              return (
                                <motion.button
                                  key={concept.id}
                                  onClick={() => handleConceptClick(concept.id)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`p-4 rounded-lg border-2 font-medium text-sm min-h-[80px] flex flex-col items-center justify-center gap-2 transition-all ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                                      : connections.length > 0
                                      ? "border-success bg-success/10"
                                      : "border-border bg-card hover:border-primary"
                                  }`}
                                >
                                  <span>{concept.text}</span>
                                  {connections.length > 0 && (
                                    <span className="text-xs opacity-70">
                                      {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
                                    </span>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>

                          {userConnections.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Your Connections:</p>
                              <div className="space-y-1">
                                {userConnections.map((conn, idx) => {
                                  const fromConcept = sampleConcepts.concepts.find(c => c.id === conn.from);
                                  const toConcept = sampleConcepts.concepts.find(c => c.id === conn.to);
                                  const isCorrect = sampleConcepts.correctConnections.some(
                                    c => (c.from === conn.from && c.to === conn.to) ||
                                         (c.from === conn.to && c.to === conn.from)
                                  );
                                  
                                  return (
                                    <div
                                      key={idx}
                                      className={`text-sm p-2 rounded border ${
                                        isCorrect 
                                          ? 'border-success bg-success/10 text-success-foreground' 
                                          : 'border-muted bg-muted/50'
                                      }`}
                                    >
                                      {fromConcept?.text} ↔ {toConcept?.text}
                                    </div>
                                  );
                                })}
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => setUserConnections([])}
                                size="sm"
                                className="w-full"
                              >
                                Clear All
                              </Button>
                            </div>
                          )}
                        </>
                      )}
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
