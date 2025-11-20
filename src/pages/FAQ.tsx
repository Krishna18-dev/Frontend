import { Card } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "What is AI StudyHub?",
      answer:
        "AI StudyHub is a learning platform that helps students discover and master AI tools, follow personalized learning paths, and get mentored by AI. It's designed for students aged 13-22.",
    },
    {
      question: "Is AI StudyHub free?",
      answer:
        "Yes! AI StudyHub is completely free to use. We believe in making AI education accessible to everyone.",
    },
    {
      question: "What AI tools can I learn about?",
      answer:
        "You can learn about Gamma.ai for presentations, Suno.ai for music, InVideo.ai for videos, Cursor for coding, ChatGPT for research, and many more tools.",
    },
    {
      question: "How does the AI Mentor work?",
      answer:
        "The AI Mentor is a chatbot that provides personalized guidance, project ideas, and instant help. It learns from your goals and helps you choose the right tools and learning paths.",
    },
    {
      question: "Can I track my progress?",
      answer:
        "Yes! Your dashboard shows all your saved work, learning progress, skills earned, and badges. You can see how far you've come and what to learn next.",
    },
    {
      question: "What are mock interviews?",
      answer:
        "Mock interviews let you practice technical and behavioral interviews with AI. You get instant feedback on your answers and tips for improvement.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about AI StudyHub
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-8 bg-muted/50 text-center">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            We're here to help! Reach out to us anytime.
          </p>
          <a
            href="mailto:support@aistudyhub.com"
            className="text-primary hover:underline"
          >
            support@aistudyhub.com
          </a>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
