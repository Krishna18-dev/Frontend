// Mock data for the application

export interface AITool {
  id: string;
  name: string;
  short: string;
  desc: string;
  categories: string[];
  useCases: string[];
  docsUrl?: string;
  externalUrl?: string;
  icon?: string;
}

export interface SavedWork {
  id: string;
  userId: string;
  title: string;
  tool: string;
  type: string;
  progress: number;
  metadata: {
    externalId?: string;
    previewUrl?: string;
    lastModified: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  ageGroup: string;
  skills: string[];
  goals: string[];
}

export const mockTools: AITool[] = [
  {
    id: "gamma",
    name: "Gamma.ai",
    short: "AI Presentation Builder",
    desc: "Create stunning presentations, documents, and websites with AI. Perfect for school projects and portfolios.",
    categories: ["presentation", "creativity"],
    useCases: ["School presentations", "Portfolio websites", "Project documentation"],
    externalUrl: "https://gamma.app",
    icon: "Presentation",
  },
  {
    id: "suno",
    name: "Suno.ai",
    short: "AI Music Generator",
    desc: "Generate original music and songs with AI. Create background music for videos or just for fun.",
    categories: ["audio", "creativity"],
    useCases: ["Video background music", "Creative projects", "Music exploration"],
    externalUrl: "https://suno.ai",
    icon: "Music",
  },
  {
    id: "invideo",
    name: "InVideo.ai",
    short: "AI Video Creator",
    desc: "Turn text into professional videos. Perfect for YouTube, social media, and class projects.",
    categories: ["video", "creativity"],
    useCases: ["YouTube videos", "Social media content", "Project presentations"],
    externalUrl: "https://invideo.ai",
    icon: "Video",
  },
  {
    id: "cursor",
    name: "Cursor",
    short: "AI Code Editor",
    desc: "Code with AI assistance. Get suggestions, explanations, and debug help while learning to code.",
    categories: ["code", "productivity"],
    useCases: ["Learning to code", "Building projects", "Debugging"],
    externalUrl: "https://cursor.sh",
    icon: "Code",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    short: "AI Assistant",
    desc: "Get help with homework, brainstorm ideas, and learn new concepts with conversational AI.",
    categories: ["research", "productivity"],
    useCases: ["Homework help", "Research", "Learning new topics"],
    externalUrl: "https://chat.openai.com",
    icon: "MessageSquare",
  },
  {
    id: "canva",
    name: "Canva AI",
    short: "Design Tool",
    desc: "Create graphics, posters, and social media content with AI-powered design assistance.",
    categories: ["presentation", "creativity"],
    useCases: ["Social media posts", "Posters", "Graphics"],
    externalUrl: "https://canva.com",
    icon: "Palette",
  },
];

export const mockCategories = [
  { id: "creativity", name: "Creativity", description: "Unleash your creative potential" },
  { id: "productivity", name: "Productivity", description: "Work smarter, not harder" },
  { id: "coding", name: "Coding", description: "Build amazing software" },
  { id: "communication", name: "Communication", description: "Express ideas clearly" },
  { id: "research", name: "Research", description: "Discover and learn" },
];

export const mockSavedWorks: SavedWork[] = [
  {
    id: "s_1",
    userId: "u_123",
    title: "Data Structures Presentation",
    tool: "gamma",
    type: "presentation",
    progress: 75,
    metadata: {
      externalId: "g_234",
      previewUrl: "https://example.com/preview",
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "s_2",
    userId: "u_123",
    title: "Portfolio Website",
    tool: "gamma",
    type: "website",
    progress: 40,
    metadata: {
      externalId: "g_567",
      previewUrl: "https://example.com/preview2",
      lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "s_3",
    userId: "u_123",
    title: "Study Background Music",
    tool: "suno",
    type: "audio",
    progress: 100,
    metadata: {
      externalId: "s_789",
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

export const mockUserProfile: UserProfile = {
  id: "u_123",
  name: "Alex Student",
  email: "alex@example.com",
  ageGroup: "18-22",
  skills: ["JavaScript", "Presentations", "Video Editing"],
  goals: ["Build portfolio", "Get internship", "Learn AI tools"],
};
