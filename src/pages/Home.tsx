import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, TrendingUp, CheckCircle2, Star, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: BookOpen,
      title: "AI-Powered Learning",
      description: "Get personalized study plans and content recommendations tailored to your learning style and goals.",
      color: "primary",
    },
    {
      icon: Users,
      title: "Expert-Led Content",
      description: "Learn from industry professionals and access high-quality courses across various subjects.",
      color: "success",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your achievements, earn certificates, and visualize your learning journey.",
      color: "accent",
    },
    {
      icon: CheckCircle2,
      title: "Interactive Practice",
      description: "Engage with hands-on exercises, coding challenges, and real-world projects.",
      color: "primary",
    },
    {
      icon: Award,
      title: "Earn Certifications",
      description: "Validate your skills with industry-recognized certificates upon course completion.",
      color: "success",
    },
    {
      icon: Star,
      title: "24/7 AI Support",
      description: "Get instant help with your questions from our AI study companion anytime, anywhere.",
      color: "accent",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        
        {/* Parallax Background Elements */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2 text-sm font-medium">
                Welcome to the Future of Learning
              </Badge>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold text-white leading-tight"
            >
              Learn with AI-Powered
              <br />
              <span className="text-white/90">Study Tools</span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Master new skills with personalized AI assistance, interactive learning paths, 
              and tools trusted by thousands of students worldwide.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                    <Link to="/auth">
                      Get Started Free
                    </Link>
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold px-8" asChild>
                  <Link to="/learn">
                    <Play className="mr-2 h-5 w-5" />
                    Explore Courses
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/70 text-sm"
            >
              {[
                { icon: Users, text: "10,000+ Active Learners" },
                { icon: Star, text: "4.8/5 Average Rating", special: true },
                { icon: Award, text: "50+ Learning Paths" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className={`h-5 w-5 ${item.special ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold mb-4">
              Why Choose AI StudyHub
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to accelerate your learning journey and achieve your goals.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-8 border hover:shadow-xl transition-all duration-300 bg-card h-full">
                    <motion.div
                      className={`mb-4 p-3 rounded-lg bg-${feature.color}/10 w-fit`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              { value: "10K+", label: "Active Students" },
              { value: "500+", label: "Courses Available" },
              { value: "50+", label: "Expert Instructors" },
              { value: "95%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <motion.div key={index} className="space-y-2" variants={itemVariants}>
                <motion.p
                  className="text-4xl sm:text-5xl font-display font-bold text-primary"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden p-12 sm:p-16 bg-gradient-primary border-0">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
              <div className="relative text-center space-y-6 max-w-3xl mx-auto">
                <motion.h2
                  className="text-3xl sm:text-4xl font-display font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Start Your Learning Journey Today
                </motion.h2>
                <motion.p
                  className="text-lg text-white/90 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Join thousands of students already learning with AI-powered tools. 
                  Get started with our free plan and upgrade anytime.
                </motion.p>
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                      <Link to={user ? "/dashboard" : "/auth"}>
                        {user ? "Go to Dashboard" : "Get Started Free"}
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
