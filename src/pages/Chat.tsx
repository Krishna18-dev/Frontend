import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Lightbulb, Target, Zap } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Study Mentor. I can help you with project ideas, learning paths, tool recommendations, and any questions you have. What would you like to work on today?",
      suggestions: [
        "Help me choose an AI tool for my project",
        "I need ideas for a school presentation",
        "What should I learn next?",
        "How can I improve my coding skills?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (in real app, call API)
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on what you're trying to achieve, I'd recommend starting with Gamma.ai for creating presentations. It's intuitive and perfect for students.",
        "I can help you with that! Let's break this down into smaller steps. First, what's the main topic or goal of your project?",
        "Excellent! For improving your coding skills, I suggest starting with our Coding learning path. Would you like me to recommend some specific projects?",
        "That sounds like an interesting project! I can suggest some AI tools that would be perfect for this. What's your timeline?",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: randomResponse,
          suggestions: [
            "Show me the learning path",
            "What tools do I need?",
            "Give me a project template",
          ],
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI Study Mentor</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Your Personal{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Mentor
            </span>
          </h1>
          <p className="text-muted-foreground">
            Get personalized guidance, project ideas, and instant help
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex flex-col h-[600px] shadow-lg">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-gradient-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {/* Suggestions */}
                  {message.suggestions && message.role === "assistant" && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium opacity-70">
                        Suggested prompts:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-background/50 hover:bg-background transition-colors border border-border/40"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/40 p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything... (Shift+Enter for new line)"
                className="min-h-[60px] max-h-[120px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                variant="gradient"
                size="icon"
                className="h-[60px] w-[60px] flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Get Project Ideas</h3>
                <p className="text-xs text-muted-foreground">
                  Brainstorm creative project concepts
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-glow/10 group-hover:bg-primary-glow/20 transition-colors">
                <Target className="h-5 w-5 text-primary-glow" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Learning Path</h3>
                <p className="text-xs text-muted-foreground">
                  Get personalized learning recommendations
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Tool Recommendations</h3>
                <p className="text-xs text-muted-foreground">
                  Find the perfect AI tool for your needs
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
