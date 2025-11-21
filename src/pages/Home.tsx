import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, TrendingUp, CheckCircle2, Star, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2 text-sm font-medium">
              Welcome to the Future of Learning
            </Badge>
            
            <h1 className="font-display font-bold text-white leading-tight">
              Learn with AI-Powered
              <br />
              <span className="text-white/90">Study Tools</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Master new skills with personalized AI assistance, interactive learning paths, 
              and tools trusted by thousands of students worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {user ? (
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                  <Link to="/auth">
                    Get Started Free
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold px-8" asChild>
                <Link to="/learn">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Courses
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>10,000+ Active Learners</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>4.8/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>50+ Learning Paths</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-display font-bold mb-4">
              Why Choose AI StudyHub
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to accelerate your learning journey and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border hover:shadow-lg transition-all duration-300 bg-card">
              <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">AI-Powered Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get personalized study plans and content recommendations tailored to your learning style and goals.
              </p>
            </Card>

            <Card className="p-8 border hover:shadow-lg transition-all duration-300 bg-card">
              <div className="mb-4 p-3 rounded-lg bg-success/10 w-fit">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Expert-Led Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn from industry professionals and access high-quality courses across various subjects.
              </p>
            </Card>

            <Card className="p-8 border hover:shadow-lg transition-all duration-300 bg-card">
              <div className="mb-4 p-3 rounded-lg bg-accent/10 w-fit">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Track Your Progress</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor your achievements, earn certificates, and visualize your learning journey.
              </p>
            </Card>

            <Card className="p-8 border hover:shadow-lg transition-all duration-300 bg-card">
              <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Interactive Practice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Engage with hands-on exercises, coding challenges, and real-world projects.
              </p>
            </Card>

            <Card className="p-8 border hover:shadow-lg transition-all duration-300 bg-card">
              <div className="mb-4 p-3 rounded-lg bg-success/10 w-fit">
                <Award className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Earn Certifications</h3>
              <p className="text-muted-foreground leading-relaxed">
                Validate your skills with industry-recognized certificates upon course completion.
              </p>
            </Card>

            <Card className="p-8 border hover:shadow-lg transition-all duration-300 bg-card">
              <div className="mb-4 p-3 rounded-lg bg-accent/10 w-fit">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">24/7 AI Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get instant help with your questions from our AI study companion anytime, anywhere.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-display font-bold text-primary">10K+</p>
              <p className="text-muted-foreground font-medium">Active Students</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-display font-bold text-primary">500+</p>
              <p className="text-muted-foreground font-medium">Courses Available</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-display font-bold text-primary">50+</p>
              <p className="text-muted-foreground font-medium">Expert Instructors</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-display font-bold text-primary">95%</p>
              <p className="text-muted-foreground font-medium">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-12 sm:p-16 bg-gradient-primary border-0">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
            <div className="relative text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                Start Your Learning Journey Today
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Join thousands of students already learning with AI-powered tools. 
                Get started with our free plan and upgrade anytime.
              </p>
              <div className="pt-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                  <Link to={user ? "/dashboard" : "/auth"}>
                    {user ? "Go to Dashboard" : "Get Started Free"}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
