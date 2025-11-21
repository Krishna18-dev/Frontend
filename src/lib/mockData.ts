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
  // General AI Assistants
  {
    id: "chatgpt",
    name: "ChatGPT",
    short: "AI Assistant",
    desc: "OpenAI's powerful conversational AI for general tasks, research, coding, and brainstorming.",
    categories: ["general", "research", "coding"],
    useCases: ["Research assistance", "Code generation", "Content brainstorming", "Problem solving"],
    externalUrl: "https://chat.openai.com",
    icon: "MessageSquare",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    short: "Google AI Assistant",
    desc: "Google's multimodal AI for general tasks, research, analysis, and creative work.",
    categories: ["general", "research"],
    useCases: ["Research", "Data analysis", "Content creation", "General assistance"],
    externalUrl: "https://gemini.google.com",
    icon: "Sparkles",
  },
  {
    id: "claude",
    name: "Claude",
    short: "Anthropic AI",
    desc: "Anthropic's AI assistant known for detailed analysis, coding, and thoughtful responses.",
    categories: ["general", "research", "coding"],
    useCases: ["Deep analysis", "Technical writing", "Code review", "Complex reasoning"],
    externalUrl: "https://claude.ai",
    icon: "Brain",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    short: "AI Search Engine",
    desc: "AI-powered search engine with real-time information and cited sources for research.",
    categories: ["general", "research"],
    useCases: ["Real-time research", "Fact-checking", "Academic research", "News updates"],
    externalUrl: "https://perplexity.ai",
    icon: "Search",
  },

  // Workflow & Workspace Assistance
  {
    id: "notion-ai",
    name: "Notion AI",
    short: "AI Workspace",
    desc: "Integrated AI in Notion for writing, editing, and organizing workspace content.",
    categories: ["workflow", "productivity"],
    useCases: ["Document creation", "Note-taking", "Project organization", "Team collaboration"],
    externalUrl: "https://notion.so",
    icon: "FileText",
  },
  {
    id: "clickup-ai",
    name: "ClickUp AI",
    short: "AI Project Management",
    desc: "AI features within ClickUp for task management, summaries, and workflow optimization.",
    categories: ["workflow", "productivity", "project-management"],
    useCases: ["Task automation", "Project summaries", "Workflow optimization", "Team coordination"],
    externalUrl: "https://clickup.com",
    icon: "CheckSquare",
  },
  {
    id: "copilot-365",
    name: "Copilot for Microsoft 365",
    short: "Microsoft AI Assistant",
    desc: "AI assistant integrated across Microsoft 365 apps for enhanced productivity.",
    categories: ["workflow", "productivity"],
    useCases: ["Email drafting", "Document editing", "Data analysis", "Meeting summaries"],
    externalUrl: "https://microsoft.com/copilot",
    icon: "Briefcase",
  },

  // Workflow Automation
  {
    id: "zapier",
    name: "Zapier",
    short: "Workflow Automation",
    desc: "Connect and automate workflows between thousands of apps without coding.",
    categories: ["automation", "productivity"],
    useCases: ["App integration", "Task automation", "Data syncing", "Workflow creation"],
    externalUrl: "https://zapier.com",
    icon: "Zap",
  },
  {
    id: "make",
    name: "Make",
    short: "Visual Automation",
    desc: "Visual platform for building complex automation workflows with no-code tools.",
    categories: ["automation", "productivity"],
    useCases: ["Complex workflows", "Data processing", "API integration", "Business automation"],
    externalUrl: "https://make.com",
    icon: "GitBranch",
  },

  // Content Generation
  {
    id: "jasper",
    name: "Jasper",
    short: "AI Content Platform",
    desc: "Professional AI writing assistant for marketing content, blogs, and social media.",
    categories: ["content", "writing"],
    useCases: ["Blog posts", "Marketing copy", "Social media content", "Ad creation"],
    externalUrl: "https://jasper.ai",
    icon: "PenTool",
  },
  {
    id: "writesonic",
    name: "Writesonic",
    short: "AI Writing Tool",
    desc: "AI-powered content creation for articles, ads, landing pages, and more.",
    categories: ["content", "writing"],
    useCases: ["Article writing", "Landing pages", "Product descriptions", "Email campaigns"],
    externalUrl: "https://writesonic.com",
    icon: "Edit3",
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    short: "AI Copywriter",
    desc: "Generate high-quality marketing copy and content in seconds with AI.",
    categories: ["content", "writing"],
    useCases: ["Marketing copy", "Social posts", "Product descriptions", "Blog ideas"],
    externalUrl: "https://copy.ai",
    icon: "Type",
  },
  {
    id: "rytr",
    name: "Rytr",
    short: "AI Writing Assistant",
    desc: "Affordable AI writing tool for emails, blogs, ads, and creative content.",
    categories: ["content", "writing"],
    useCases: ["Email writing", "Blog content", "Ad copy", "Creative writing"],
    externalUrl: "https://rytr.me",
    icon: "Feather",
  },
  {
    id: "sudowrite",
    name: "Sudowrite",
    short: "AI Creative Writing",
    desc: "AI writing assistant specifically designed for creative writers and storytelling.",
    categories: ["content", "writing", "creativity"],
    useCases: ["Fiction writing", "Story development", "Character creation", "Creative brainstorming"],
    externalUrl: "https://sudowrite.com",
    icon: "BookOpen",
  },

  // Editing & Text Refinement
  {
    id: "grammarly",
    name: "Grammarly",
    short: "AI Writing Assistant",
    desc: "Real-time grammar, spelling, and style suggestions to improve your writing.",
    categories: ["editing", "writing"],
    useCases: ["Grammar checking", "Style improvement", "Tone adjustment", "Clarity enhancement"],
    externalUrl: "https://grammarly.com",
    icon: "CheckCircle",
  },
  {
    id: "wordtune",
    name: "Wordtune",
    short: "AI Rewriting Tool",
    desc: "Rewrite and rephrase text to improve clarity, tone, and engagement.",
    categories: ["editing", "writing"],
    useCases: ["Text rewriting", "Tone adjustment", "Sentence restructuring", "Content polishing"],
    externalUrl: "https://wordtune.com",
    icon: "RefreshCw",
  },

  // SEO Optimization
  {
    id: "surfer-seo",
    name: "Surfer SEO",
    short: "SEO Content Optimizer",
    desc: "Data-driven SEO tool for optimizing content and improving search rankings.",
    categories: ["seo", "content"],
    useCases: ["Content optimization", "Keyword research", "SEO audits", "Rank tracking"],
    externalUrl: "https://surferseo.com",
    icon: "TrendingUp",
  },
  {
    id: "outranking",
    name: "Outranking",
    short: "AI SEO Platform",
    desc: "AI-powered SEO content planning, writing, and optimization platform.",
    categories: ["seo", "content"],
    useCases: ["Content briefs", "SEO writing", "Competitor analysis", "Content optimization"],
    externalUrl: "https://outranking.io",
    icon: "BarChart",
  },

  // Meeting Transcription & Summaries
  {
    id: "fireflies",
    name: "Fireflies.ai",
    short: "AI Meeting Assistant",
    desc: "Automatically record, transcribe, and summarize meetings across platforms.",
    categories: ["meeting", "productivity"],
    useCases: ["Meeting transcription", "Action items", "Meeting summaries", "Team collaboration"],
    externalUrl: "https://fireflies.ai",
    icon: "Mic",
  },
  {
    id: "otter",
    name: "Otter.ai",
    short: "Meeting Transcription",
    desc: "Real-time meeting transcription and note-taking with AI-powered insights.",
    categories: ["meeting", "productivity"],
    useCases: ["Live transcription", "Meeting notes", "Interview transcription", "Lecture notes"],
    externalUrl: "https://otter.ai",
    icon: "FileAudio",
  },
  {
    id: "fathom",
    name: "Fathom",
    short: "Free AI Meeting Notes",
    desc: "Free AI notetaker that records, transcribes, and summarizes your meetings.",
    categories: ["meeting", "productivity"],
    useCases: ["Meeting summaries", "Call recording", "Action tracking", "Team sync"],
    externalUrl: "https://fathom.video",
    icon: "Video",
  },

  // Text Summarization
  {
    id: "quillbot-summarizer",
    name: "QuillBot Summarizer",
    short: "Text Summarization",
    desc: "Quickly summarize articles, papers, and documents with AI.",
    categories: ["summarization", "research"],
    useCases: ["Article summaries", "Research papers", "Document analysis", "Quick reading"],
    externalUrl: "https://quillbot.com/summarize",
    icon: "FileText",
  },
  {
    id: "smallpdf-summarizer",
    name: "Smallpdf Summarizer",
    short: "PDF Summarization",
    desc: "AI-powered PDF summarization and document analysis tool.",
    categories: ["summarization", "research"],
    useCases: ["PDF summaries", "Document analysis", "Report summaries", "Quick insights"],
    externalUrl: "https://smallpdf.com",
    icon: "File",
  },

  // Scheduling & Task Prioritization
  {
    id: "motion",
    name: "Motion",
    short: "AI Calendar",
    desc: "AI-powered calendar that automatically schedules tasks and meetings.",
    categories: ["scheduling", "productivity"],
    useCases: ["Auto-scheduling", "Task management", "Calendar optimization", "Time blocking"],
    externalUrl: "https://usemotion.com",
    icon: "Calendar",
  },
  {
    id: "reclaim",
    name: "Reclaim.ai",
    short: "Smart Calendar",
    desc: "AI calendar assistant that defends time for priorities and habits.",
    categories: ["scheduling", "productivity"],
    useCases: ["Time management", "Meeting scheduling", "Habit tracking", "Focus time"],
    externalUrl: "https://reclaim.ai",
    icon: "Clock",
  },
  {
    id: "clockwise",
    name: "Clockwise",
    short: "Time Orchestration",
    desc: "AI-powered calendar tool for optimizing team schedules and focus time.",
    categories: ["scheduling", "productivity"],
    useCases: ["Team scheduling", "Focus time", "Meeting coordination", "Calendar sync"],
    externalUrl: "https://getclockwise.com",
    icon: "Watch",
  },

  // Project Planning & Management
  {
    id: "asana-ai",
    name: "Asana AI",
    short: "AI Project Management",
    desc: "AI-powered features in Asana for project planning, task management, and automation.",
    categories: ["project-management", "productivity"],
    useCases: ["Project planning", "Task automation", "Risk prediction", "Team coordination"],
    externalUrl: "https://asana.com",
    icon: "Trello",
  },
  {
    id: "wrike",
    name: "Wrike",
    short: "Work Management Platform",
    desc: "Comprehensive project management with AI-powered insights and automation.",
    categories: ["project-management", "productivity"],
    useCases: ["Project tracking", "Resource management", "Workflow automation", "Reporting"],
    externalUrl: "https://wrike.com",
    icon: "Layers",
  },

  // Image Generation
  {
    id: "midjourney",
    name: "Midjourney",
    short: "AI Art Generator",
    desc: "Create stunning, high-quality images from text descriptions using AI.",
    categories: ["image", "creativity"],
    useCases: ["Digital art", "Concept art", "Illustrations", "Creative projects"],
    externalUrl: "https://midjourney.com",
    icon: "Image",
  },
  {
    id: "dalle",
    name: "DALL-E",
    short: "OpenAI Image Generator",
    desc: "OpenAI's powerful image generation model for creating unique visuals.",
    categories: ["image", "creativity"],
    useCases: ["Image generation", "Product mockups", "Creative concepts", "Visual content"],
    externalUrl: "https://openai.com/dall-e",
    icon: "Palette",
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    short: "AI Creative Suite",
    desc: "AI-powered platform for generating game assets, art, and creative content.",
    categories: ["image", "creativity"],
    useCases: ["Game assets", "Character design", "Environment art", "Concept creation"],
    externalUrl: "https://leonardo.ai",
    icon: "Brush",
  },

  // Graphic Design
  {
    id: "canva-magic",
    name: "Canva Magic Studio",
    short: "AI Design Platform",
    desc: "Canva's AI-powered design tools for creating graphics, presentations, and social content.",
    categories: ["design", "creativity"],
    useCases: ["Social media graphics", "Presentations", "Marketing materials", "Brand design"],
    externalUrl: "https://canva.com",
    icon: "Scissors",
  },
  {
    id: "looka",
    name: "Looka",
    short: "AI Logo Maker",
    desc: "AI-powered logo and brand identity design platform.",
    categories: ["design", "creativity"],
    useCases: ["Logo design", "Brand identity", "Business cards", "Marketing materials"],
    externalUrl: "https://looka.com",
    icon: "Target",
  },

  // Video & Audio Editing
  {
    id: "descript",
    name: "Descript",
    short: "AI Video Editor",
    desc: "Edit video and audio by editing text with AI-powered features.",
    categories: ["video", "audio", "editing"],
    useCases: ["Video editing", "Podcast editing", "Transcription", "Screen recording"],
    externalUrl: "https://descript.com",
    icon: "Film",
  },
  {
    id: "pictory",
    name: "Pictory AI",
    short: "Text to Video",
    desc: "Transform text into engaging videos with AI-powered editing and voiceovers.",
    categories: ["video", "content"],
    useCases: ["Video creation", "Social media videos", "Marketing content", "Presentations"],
    externalUrl: "https://pictory.ai",
    icon: "PlayCircle",
  },
  {
    id: "synthesia",
    name: "Synthesia",
    short: "AI Video Platform",
    desc: "Create professional videos with AI avatars and voiceovers in minutes.",
    categories: ["video", "content"],
    useCases: ["Training videos", "Product demos", "Marketing videos", "Presentations"],
    externalUrl: "https://synthesia.io",
    icon: "Users",
  },

  // Code Assistance
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    short: "AI Pair Programmer",
    desc: "AI-powered code completion and suggestions directly in your editor.",
    categories: ["coding", "development"],
    useCases: ["Code completion", "Function generation", "Code documentation", "Bug fixing"],
    externalUrl: "https://github.com/features/copilot",
    icon: "Code",
  },
  {
    id: "tabnine",
    name: "Tabnine",
    short: "AI Code Assistant",
    desc: "AI code completion that learns from your coding patterns and style.",
    categories: ["coding", "development"],
    useCases: ["Code suggestions", "Auto-completion", "Code generation", "Team learning"],
    externalUrl: "https://tabnine.com",
    icon: "Terminal",
  },
  {
    id: "codewhisperer",
    name: "Amazon CodeWhisperer",
    short: "AWS AI Coding",
    desc: "Amazon's AI coding companion with real-time code suggestions.",
    categories: ["coding", "development"],
    useCases: ["AWS development", "Code suggestions", "Security scanning", "Reference tracking"],
    externalUrl: "https://aws.amazon.com/codewhisperer",
    icon: "Cloud",
  },
  {
    id: "replit-ai",
    name: "Replit AI",
    short: "AI Dev Environment",
    desc: "AI-powered development environment for coding, collaboration, and deployment.",
    categories: ["coding", "development"],
    useCases: ["Quick prototyping", "Learning to code", "Collaboration", "Instant deployment"],
    externalUrl: "https://replit.com",
    icon: "Box",
  },
  {
    id: "codeium",
    name: "Codeium",
    short: "Free AI Code Tool",
    desc: "Free AI-powered code acceleration toolkit with autocomplete and chat.",
    categories: ["coding", "development"],
    useCases: ["Code completion", "Code explanation", "Refactoring", "Bug detection"],
    externalUrl: "https://codeium.com",
    icon: "Rocket",
  },
  {
    id: "kite",
    name: "Kite",
    short: "Python AI Assistant",
    desc: "AI-powered code completion specifically optimized for Python development.",
    categories: ["coding", "development"],
    useCases: ["Python coding", "Documentation lookup", "Code examples", "Function signatures"],
    externalUrl: "https://kite.com",
    icon: "Code2",
  },
  {
    id: "deepcode",
    name: "DeepCode",
    short: "AI Code Review",
    desc: "AI-powered code review and bug detection for multiple programming languages.",
    categories: ["coding", "development"],
    useCases: ["Code review", "Bug detection", "Security analysis", "Code quality"],
    externalUrl: "https://deepcode.ai",
    icon: "Shield",
  },
  {
    id: "openai-codex",
    name: "OpenAI Codex",
    short: "Natural Language to Code",
    desc: "Transform natural language descriptions into functional code across languages.",
    categories: ["coding", "development"],
    useCases: ["Code generation", "Natural language coding", "API usage", "Code translation"],
    externalUrl: "https://openai.com/blog/openai-codex",
    icon: "Cpu",
  },
];

export const mockCategories = [
  { id: "general", name: "General AI", description: "Multi-purpose AI assistants" },
  { id: "research", name: "Research", description: "Information gathering and analysis" },
  { id: "coding", name: "Coding", description: "Development and programming tools" },
  { id: "workflow", name: "Workflow", description: "Workspace and productivity" },
  { id: "automation", name: "Automation", description: "Workflow automation tools" },
  { id: "content", name: "Content", description: "Content creation and writing" },
  { id: "writing", name: "Writing", description: "Writing and copywriting" },
  { id: "editing", name: "Editing", description: "Text refinement and improvement" },
  { id: "seo", name: "SEO", description: "Search engine optimization" },
  { id: "meeting", name: "Meeting", description: "Meeting tools and transcription" },
  { id: "summarization", name: "Summarization", description: "Text summarization" },
  { id: "scheduling", name: "Scheduling", description: "Calendar and time management" },
  { id: "project-management", name: "Project Management", description: "Planning and coordination" },
  { id: "image", name: "Image Generation", description: "AI image creation" },
  { id: "design", name: "Design", description: "Graphic design tools" },
  { id: "video", name: "Video", description: "Video creation and editing" },
  { id: "audio", name: "Audio", description: "Audio editing and creation" },
  { id: "creativity", name: "Creativity", description: "Creative and artistic tools" },
  { id: "productivity", name: "Productivity", description: "Efficiency and task management" },
  { id: "development", name: "Development", description: "Software development tools" },
];

export const mockSavedWorks: SavedWork[] = [];

export const mockUserProfile: UserProfile = {
  id: "u_123",
  name: "Alex Student",
  email: "alex@example.com",
  ageGroup: "18-22",
  skills: ["JavaScript", "Presentations", "Video Editing"],
  goals: ["Build portfolio", "Get internship", "Learn AI tools"],
};
