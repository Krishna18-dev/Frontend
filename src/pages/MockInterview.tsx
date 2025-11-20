import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Target, Clock, CheckCircle2, TrendingUp, MessageSquare } from "lucide-react";

interface InterviewState {
  stage: "setup" | "interview" | "results";
  role?: string;
  difficulty?: string;
  currentQuestion: number;
  questions: string[];
  answers: string[];
}

const mockQuestions = {
  "Data Structures": {
    Beginner: [
      "Can you explain what an array is and how it differs from a linked list?",
      "What is a stack and where would you use it?",
      "Describe the concept of a queue and give a real-world example.",
    ],
    Intermediate: [
      "Explain the difference between a binary tree and a binary search tree.",
      "How would you implement a hash table? What are the key considerations?",
      "Describe the time complexity of common operations on different data structures.",
    ],
  },
  "Frontend Development": {
    Beginner: [
      "What is the difference between HTML, CSS, and JavaScript?",
      "Can you explain what the DOM is?",
      "What are the main differences between var, let, and const in JavaScript?",
    ],
    Intermediate: [
      "How does React's virtual DOM work?",
      "Explain the concept of state management in modern web applications.",
      "What are the key differences between client-side and server-side rendering?",
    ],
  },
};

const MockInterview = () => {
  const [state, setState] = useState<InterviewState>({
    stage: "setup",
    currentQuestion: 0,
    questions: [],
    answers: [],
  });
  const [currentAnswer, setCurrentAnswer] = useState("");

  const roles = ["Data Structures", "Frontend Development", "Backend Development"];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const startInterview = () => {
    if (!state.role || !state.difficulty) return;

    const roleQuestions = mockQuestions[state.role as keyof typeof mockQuestions];
    const questions = roleQuestions?.[state.difficulty as "Beginner" | "Intermediate"] || [];

    setState({
      ...state,
      stage: "interview",
      questions,
      currentQuestion: 0,
      answers: [],
    });
  };

  const submitAnswer = () => {
    const newAnswers = [...state.answers, currentAnswer];
    const nextQuestion = state.currentQuestion + 1;

    if (nextQuestion < state.questions.length) {
      setState({
        ...state,
        currentQuestion: nextQuestion,
        answers: newAnswers,
      });
      setCurrentAnswer("");
    } else {
      setState({
        ...state,
        stage: "results",
        answers: newAnswers,
      });
      setCurrentAnswer("");
    }
  };

  const resetInterview = () => {
    setState({
      stage: "setup",
      currentQuestion: 0,
      questions: [],
      answers: [],
    });
    setCurrentAnswer("");
  };

  if (state.stage === "setup") {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Target className="h-4 w-4" />
              <span>Practice Makes Perfect</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              AI Mock{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice interviews with AI-powered feedback and improve your skills
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Select Role</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      variant={state.role === role ? "default" : "outline"}
                      onClick={() => setState({ ...state, role })}
                      className="h-auto py-4"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Select Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={state.difficulty === difficulty ? "default" : "outline"}
                      onClick={() => setState({ ...state, difficulty })}
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={startInterview}
                  disabled={!state.role || !state.difficulty}
                >
                  Start Interview
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (state.stage === "interview") {
    const progress = ((state.currentQuestion + 1) / state.questions.length) * 100;
    const currentQ = state.questions[state.currentQuestion];

    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">
                Question {state.currentQuestion + 1} of {state.questions.length}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>No time limit</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-8 mb-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{currentQ}</h2>
                <p className="text-sm text-muted-foreground">
                  Take your time to provide a detailed answer. You can use examples to
                  support your explanation.
                </p>
              </div>

              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[200px] resize-none"
              />

              <div className="flex gap-3">
                <Button
                  variant="gradient"
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="flex-1"
                >
                  {state.currentQuestion === state.questions.length - 1
                    ? "Finish Interview"
                    : "Next Question"}
                </Button>
                <Button variant="outline" onClick={resetInterview}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">AI Tip</p>
                <p className="text-sm text-muted-foreground">
                  Structure your answer with: definition, example, and use case for best
                  results.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Results stage
  const mockScore = 75 + Math.floor(Math.random() * 20); // Random score between 75-95

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground">
            Great job completing the mock interview
          </p>
        </div>

        <Card className="p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {mockScore}%
            </div>
            <p className="text-muted-foreground">Overall Score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold mb-1">85%</p>
              <p className="text-sm text-muted-foreground">Clarity</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-primary-glow" />
              <p className="text-2xl font-bold mb-1">80%</p>
              <p className="text-sm text-muted-foreground">Correctness</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold mb-1">Good</p>
              <p className="text-sm text-muted-foreground">Pace</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Strong fundamentals</p>
                <p className="text-sm text-muted-foreground">
                  You demonstrated good understanding of core concepts
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Area for improvement</p>
                <p className="text-sm text-muted-foreground">
                  Consider adding more real-world examples in your explanations
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Communication</p>
                <p className="text-sm text-muted-foreground">
                  Your answers were clear and well-structured
                </p>
              </div>
            </li>
          </ul>
        </Card>

        <div className="flex gap-3">
          <Button variant="gradient" className="flex-1" onClick={resetInterview}>
            Try Another Interview
          </Button>
          <Button variant="outline" className="flex-1">
            View Detailed Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
