import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Code, Palette, Zap, CheckCircle2, Search, Play, Clock, Users, ExternalLink } from "lucide-react";
import { mockCategories } from "@/lib/mockData";
import { motion } from "framer-motion";

interface LearningTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed?: boolean;
}

interface YouTubeCourse {
  id: string;
  title: string;
  channel: string;
  description: string;
  duration: string;
  views: string;
  thumbnail: string;
  url: string;
  category: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
}

const learningTasks: Record<string, LearningTask[]> = {
  creativity: [
    {
      id: "cr1",
      title: "Create Your First AI Presentation",
      description: "Learn to use Gamma.ai to create stunning presentations in minutes",
      duration: "30 min",
      difficulty: "Beginner",
    },
    {
      id: "cr2",
      title: "Generate Original Music",
      description: "Use Suno.ai to create background music for your projects",
      duration: "45 min",
      difficulty: "Beginner",
    },
    {
      id: "cr3",
      title: "Design Social Media Graphics",
      description: "Master Canva AI for creating eye-catching social media content",
      duration: "1 hour",
      difficulty: "Intermediate",
    },
  ],
  productivity: [
    {
      id: "pr1",
      title: "AI-Powered Note Taking",
      description: "Learn to use AI tools for efficient note-taking and organization",
      duration: "25 min",
      difficulty: "Beginner",
    },
    {
      id: "pr2",
      title: "Automate Your Workflow",
      description: "Set up AI assistants to handle repetitive tasks",
      duration: "50 min",
      difficulty: "Intermediate",
    },
    {
      id: "pr3",
      title: "Research with AI",
      description: "Master ChatGPT for efficient research and learning",
      duration: "40 min",
      difficulty: "Beginner",
    },
  ],
  coding: [
    {
      id: "co1",
      title: "Code with AI Assistance",
      description: "Get started with Cursor and AI-powered coding",
      duration: "1 hour",
      difficulty: "Beginner",
    },
    {
      id: "co2",
      title: "Build Your First Web App",
      description: "Create a simple web application with AI help",
      duration: "2 hours",
      difficulty: "Intermediate",
    },
    {
      id: "co3",
      title: "Debug Like a Pro",
      description: "Learn to use AI for debugging and code optimization",
      duration: "45 min",
      difficulty: "Intermediate",
    },
  ],
};

const youtubeCourses: YouTubeCourse[] = [
  // Programming & Development
  {
    id: "yt1",
    title: "Complete Web Development Course - HTML, CSS, JavaScript",
    channel: "freeCodeCamp.org",
    description: "Learn full-stack web development from scratch with this comprehensive course covering HTML, CSS, JavaScript, and modern frameworks.",
    duration: "12 hours",
    views: "5M",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=mU6anWqZJcc",
    category: ["coding", "web-development"],
    level: "Beginner",
  },
  {
    id: "yt2",
    title: "Python for Beginners - Full Course",
    channel: "Programming with Mosh",
    description: "Master Python programming fundamentals with hands-on projects and real-world examples.",
    duration: "6 hours",
    views: "10M",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=_uQrJ0TkZlc",
    category: ["coding", "python"],
    level: "Beginner",
  },
  {
    id: "yt3",
    title: "React JS Full Course 2024",
    channel: "Traversy Media",
    description: "Build modern web applications with React including hooks, context API, and best practices.",
    duration: "8 hours",
    views: "3M",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=w7ejDZ8SWv8",
    category: ["coding", "web-development", "react"],
    level: "Intermediate",
  },

  // AI & Machine Learning
  {
    id: "yt4",
    title: "Machine Learning Course for Beginners",
    channel: "freeCodeCamp.org",
    description: "Introduction to machine learning concepts, algorithms, and practical applications using Python.",
    duration: "10 hours",
    views: "4M",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=NWONeJKn6kc",
    category: ["ai", "machine-learning", "coding"],
    level: "Intermediate",
  },
  {
    id: "yt5",
    title: "ChatGPT Complete Guide - Prompt Engineering",
    channel: "AI Advantage",
    description: "Master ChatGPT with advanced prompting techniques, workflows, and productivity tips.",
    duration: "2 hours",
    views: "2M",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=jC4v5AS4RIM",
    category: ["ai", "productivity"],
    level: "Beginner",
  },

  // Design & Creativity
  {
    id: "yt6",
    title: "Graphic Design Full Course",
    channel: "DesignCourse",
    description: "Learn design principles, typography, color theory, and create stunning visuals.",
    duration: "5 hours",
    views: "1.5M",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=WONZVnlam6U",
    category: ["design", "creativity"],
    level: "Beginner",
  },
  {
    id: "yt7",
    title: "Canva Tutorial for Beginners",
    channel: "Canva",
    description: "Master Canva for creating professional designs, social media content, and presentations.",
    duration: "1.5 hours",
    views: "3M",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=9qw8UjCmhc0",
    category: ["design", "creativity", "productivity"],
    level: "Beginner",
  },
  {
    id: "yt8",
    title: "UI/UX Design Course - Figma",
    channel: "DesignCourse",
    description: "Complete UI/UX design course covering user research, wireframing, prototyping in Figma.",
    duration: "4 hours",
    views: "2M",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=c9Wg6Cb_YlU",
    category: ["design", "ui-ux"],
    level: "Intermediate",
  },

  // Data Science & Analytics
  {
    id: "yt9",
    title: "Data Science Full Course",
    channel: "Simplilearn",
    description: "Complete data science course covering Python, statistics, machine learning, and data visualization.",
    duration: "9 hours",
    views: "2.5M",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=-ETQ97mXXF0",
    category: ["data-science", "coding", "analytics"],
    level: "Intermediate",
  },
  {
    id: "yt10",
    title: "Excel Tutorial for Beginners",
    channel: "Leila Gharani",
    description: "Master Excel from basics to advanced formulas, pivot tables, and data analysis.",
    duration: "3 hours",
    views: "4M",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=Vl0H-qTclOg",
    category: ["productivity", "analytics"],
    level: "Beginner",
  },

  // Business & Marketing
  {
    id: "yt11",
    title: "Digital Marketing Course 2024",
    channel: "Simplilearn",
    description: "Complete digital marketing course covering SEO, social media, content marketing, and analytics.",
    duration: "11 hours",
    views: "3M",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=nU-IIXBWlS4",
    category: ["marketing", "business"],
    level: "Beginner",
  },
  {
    id: "yt12",
    title: "SEO Tutorial for Beginners",
    channel: "Ahrefs",
    description: "Learn search engine optimization from scratch with practical strategies and tools.",
    duration: "2 hours",
    views: "1.8M",
    thumbnail: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=DvwS7cV9GmQ",
    category: ["marketing", "seo"],
    level: "Beginner",
  },

  // Personal Development
  {
    id: "yt13",
    title: "Productivity Masterclass",
    channel: "Ali Abdaal",
    description: "Transform your productivity with proven techniques, time management, and focus strategies.",
    duration: "1 hour",
    views: "2M",
    thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=Nk-nWd4s1w0",
    category: ["productivity", "personal-development"],
    level: "Beginner",
  },
  {
    id: "yt14",
    title: "Public Speaking & Communication",
    channel: "TEDx Talks",
    description: "Master public speaking, presentations, and effective communication skills.",
    duration: "45 min",
    views: "5M",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=Unzc731iCUY",
    category: ["communication", "personal-development"],
    level: "Beginner",
  },

  // Video & Content Creation
  {
    id: "yt15",
    title: "Video Editing Course - DaVinci Resolve",
    channel: "Casey Faris",
    description: "Professional video editing course using DaVinci Resolve from beginner to advanced.",
    duration: "4 hours",
    views: "1.2M",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=225&fit=crop",
    url: "https://youtube.com/watch?v=63Ln33O4p4c",
    category: ["video-editing", "creativity"],
    level: "Intermediate",
  },
];

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState("creativity");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<string | null>(null);

  const categoryIcons: Record<string, any> = {
    creativity: Palette,
    productivity: Zap,
    coding: Code,
    communication: BookOpen,
    research: GraduationCap,
  };

  const currentTasks = learningTasks[selectedCategory] || [];

  const filteredCourses = useMemo(() => {
    return youtubeCourses.filter((course) => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.channel.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCourseCategory || course.category.includes(selectedCourseCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCourseCategory]);

  const courseCategories = [
    { id: "all", name: "All Courses" },
    { id: "coding", name: "Programming" },
    { id: "web-development", name: "Web Dev" },
    { id: "ai", name: "AI & ML" },
    { id: "design", name: "Design" },
    { id: "data-science", name: "Data Science" },
    { id: "marketing", name: "Marketing" },
    { id: "productivity", name: "Productivity" },
    { id: "video-editing", name: "Video Editing" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold">
            Learning{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow guided learning paths and discover curated YouTube courses to master new skills.
          </p>
        </motion.div>

        <Tabs defaultValue="paths" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="courses">YouTube Courses</TabsTrigger>
          </TabsList>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-8">
            {/* Category Selection */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {mockCategories.map((category) => {
                const Icon = categoryIcons[category.id] || BookOpen;
                const isSelected = selectedCategory === category.id;
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        isSelected ? "ring-2 ring-primary shadow-md" : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="text-center space-y-3">
                        <div
                          className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? "bg-primary" : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isSelected ? "text-white" : "text-primary"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Learning Tasks */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Learning Path</h2>
                <Badge variant="secondary">
                  {currentTasks.length} {currentTasks.length === 1 ? "Task" : "Tasks"}
                </Badge>
              </div>

              <div className="grid gap-6">
                {currentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-grow space-y-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-muted-foreground">{task.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{task.duration}</Badge>
                            <Badge
                              variant={
                                task.difficulty === "Beginner"
                                  ? "secondary"
                                  : task.difficulty === "Intermediate"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {task.difficulty}
                            </Badge>
                            {task.completed && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:items-end justify-center">
                          <Button variant="gradient" className="w-full md:w-auto">
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* YouTube Courses Tab */}
          <TabsContent value="courses" className="space-y-8">
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses by title, channel, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {courseCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={
                      (cat.id === "all" && !selectedCourseCategory) ||
                      selectedCourseCategory === cat.id
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setSelectedCourseCategory(cat.id === "all" ? null : cat.id)
                    }
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                          {course.duration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{course.channel}</p>
                          <p className="text-sm text-foreground/80 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{course.views} views</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {course.level}
                          </Badge>
                        </div>

                        {/* Action */}
                        <Button
                          variant="gradient"
                          size="sm"
                          className="w-full mt-2"
                          asChild
                        >
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Watch Course
                          </a>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCourseCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Learn;
