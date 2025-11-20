import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatPage = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      console.log("Sending:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <h1 className="text-xl font-semibold">AI Study Companion</h1>
          </div>
          <p className="text-sm opacity-90">
            Ask me anything about your studies, career prep, or learning goals
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="h-16 w-16 text-primary/20 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
            <p className="text-muted-foreground mb-8">
              Try asking for study notes, roadmaps, practice questions, or interview prep
            </p>
          </div>
        </div>
      </div>

      <div className="border-t bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your studies..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
