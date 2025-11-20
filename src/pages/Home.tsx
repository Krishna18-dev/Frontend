import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Target, TrendingUp, MessageSquare, GraduationCap } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Your AI-Powered Learning Companion</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Master Skills with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI Tools
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover powerful AI tools, follow personalized learning paths, and get mentored by AI. 
              Perfect for students aged 13-22 building their future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/chat">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                  <MessageSquare className="mr-2" />
                  Try AI Mentor
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Zap className="mr-2" />
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Learn & Create
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI tools to personalized mentorship, we've got your learning journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Tools Directory</h3>
              <p className="text-muted-foreground">
                Access Gamma.ai, Suno.ai, InVideo.ai, and more. Create presentations, music, videos, and code with AI.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="mb-4 p-3 rounded-xl bg-primary-glow/10 w-fit group-hover:bg-primary-glow/20 transition-colors">
                <GraduationCap className="h-6 w-6 text-primary-glow" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guided Learning Paths</h3>
              <p className="text-muted-foreground">
                Follow structured courses in creativity, productivity, coding, and more. Build real projects.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="mb-4 p-3 rounded-xl bg-accent/10 w-fit group-hover:bg-accent/20 transition-colors">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Mentor Chat</h3>
              <p className="text-muted-foreground">
                Get personalized guidance, project ideas, and instant help. Your AI mentor is always available.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mock Interviews</h3>
              <p className="text-muted-foreground">
                Practice with AI-powered interviews. Get feedback on technical and behavioral questions.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="mb-4 p-3 rounded-xl bg-primary-glow/10 w-fit group-hover:bg-primary-glow/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary-glow" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey, earn badges, and see your skills grow over time.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="mb-4 p-3 rounded-xl bg-accent/10 w-fit group-hover:bg-accent/20 transition-colors">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Templates & Resources</h3>
              <p className="text-muted-foreground">
                Download ready-to-use templates, guides, and project starters to accelerate your learning.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-12 bg-gradient-primary">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
            </div>
            <div className="relative text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join thousands of students building amazing projects with AI tools and personalized guidance.
              </p>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
