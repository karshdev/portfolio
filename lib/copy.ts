/** Centralized real copy. Editable from one place. */

export const profile = {
  handle: "aakarsh.sharma",
  tagline: "full-stack developer · claude certified architect · automation",
};

export type StackGroup = {
  label: string;
  items: string[];
};

export const whoami = {
  headline: {
    parts: [
      { text: "I build " },
      { text: "secure systems", tone: "ember" },
      { text: ",\nship " },
      { text: "products", tone: "amber" },
      { text: ", and make businesses " },
      { text: "profitable", tone: "ember" },
      { text: "." },
    ],
  },
  bio: "Full-stack developer who turns ideas into products. I've shipped production systems for a Forbes 40 Under 40 founder, a $35M-funded AI marketing platform, US law firms, and an Israeli medical startup — React and Angular on the front, event-driven NestJS on the back, AI agents and automation wired through the middle.",
  stackGroups: [
    {
      label: "frontend",
      items: [
        "React",
        "Next.js",
        "Angular",
        "TypeScript",
        "Tailwind CSS",
        "ShadCN UI",
        "React Query",
        "Framer Motion",
      ],
    },
    {
      label: "backend",
      items: [
        "Node.js",
        "NestJS",
        "Express.js",
        "REST APIs",
        "WebSockets",
        "Event-Driven Architecture",
      ],
    },
    {
      label: "data",
      items: [
        "PostgreSQL",
        "MongoDB",
        "Supabase",
        "Redis",
        "Prisma",
        "Drizzle ORM",
        "TypeORM",
        "Mongoose",
      ],
    },
    {
      label: "ai / automation",
      items: [
        "LangGraph",
        "LangSmith",
        "RAG",
        "AI Agents",
        "LiveKit",
        "OpenAI APIs",
      ],
    },
    {
      label: "cloud / devops",
      items: ["AWS", "Google Cloud", "Vercel", "SQS", "Nginx", "Cloudflare", "CI/CD"],
    },
    {
      label: "integrations",
      items: [
        "Salesforce",
        "QuickBooks",
        "Stripe",
        "GoHighLevel",
        "Contentful",
        "GraphQL",
      ],
    },
  ] satisfies StackGroup[],
};

/** Flat list of every technology — used by the AI system prompt and tools. */
export const stackFlat: string[] = whoami.stackGroups.flatMap((g) => g.items);

export type ExperienceRole = {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
};

export const experience: ExperienceRole[] = [
  {
    id: "dormotech",
    title: "Full Stack Engineer",
    company: "Dormotech Medical",
    period: "Feb 2026 — Present",
    location: "Remote · Israel",
    current: true,
    bullets: [
      "Building DormoVision X, a platform unifying Home PSG and In-Lab sleep studies into one clinical workflow — up to 22 direct and 7 derived channels per study.",
      "Angular front end against an event-driven NestJS backend; SQS and Redis orchestrate long-running study processing asynchronously.",
      "Real-time study monitoring over WebSockets, backed by PostgreSQL on AWS.",
      "Contributing to system design and service architecture as the platform scales across clinics.",
    ],
    tags: ["Angular", "NestJS", "PostgreSQL", "AWS", "Redis", "SQS"],
  },
  {
    id: "meetapex",
    title: "Automation Engineer · Claude Certified Architect",
    company: "MeetApex",
    period: "Jun 2025 — Jan 2026",
    location: "Remote · Australia",
    bullets: [
      "Designed and shipped AI automation systems for an Australian automation studio, built on Claude and agentic workflows.",
      "Earned the Claude Certified Architect credential while architecting automations in production.",
      "Published full build walkthroughs of the automations to a public YouTube audience.",
    ],
    tags: ["Claude", "AI Agents", "Automation", "LangGraph"],
  },
  {
    id: "excelerate",
    title: "Junior Architect",
    company: "Excelerate Technologies (Mudish Technologies)",
    period: "Dec 2023 — May 2025",
    location: "Remote",
    bullets: [
      "Built gradial.com for Gradial, an AI-native marketing platform that raised $35M — React front end driven by GraphQL against a Contentful CMS.",
      "Shipped OSBot for Excelerate Legal: a voice and chat agent letting personal-injury firm owners query case counts and firm metrics hands-free while driving.",
      "Wired OSBot into Salesforce, GoHighLevel, and QuickBooks so every answer came from a live system of record.",
      "Contributed to VerdictStrike, an AI platform for law firms to identify, value, negotiate, and settle diminished-value claims.",
    ],
    tags: ["React", "GraphQL", "Contentful", "Salesforce", "Voice AI"],
  },
  {
    id: "freelance",
    title: "Full Stack Developer (Freelance)",
    company: "Independent · Upwork",
    period: "Jan 2023 — Nov 2023",
    location: "Remote",
    bullets: [
      "Built BrandRadar.ai end to end for a Forbes 40 Under 40 founder — a generative-engine-optimization platform that tracks whether a brand surfaces when people ask AI.",
      "Delivered both the marketing site and the full product app: tracking, page optimization, content, and authority building in one growth system.",
      "$20k+ earned on Upwork with clients across the US, Europe, and Australia.",
    ],
    tags: ["Next.js", "TypeScript", "GEO", "Product"],
  },
  {
    id: "75way",
    title: "Full Stack Developer",
    company: "75way Technologies",
    period: "Jan 2022 — Dec 2022",
    location: "India",
    bullets: [
      "First full-time engineering role — shipped client web products across the stack.",
      "Worked in React and Node.js on production codebases against real delivery deadlines.",
    ],
    tags: ["React", "Node.js", "MongoDB"],
  },
];

export const pillars = [
  {
    id: "fullstack",
    title: "Full-Stack Product",
    items: [
      "React, Next.js & Angular front ends",
      "NestJS / Express APIs & event-driven services",
      "PostgreSQL, Redis, and queue-backed workflows",
    ],
  },
  {
    id: "ai",
    title: "AI & Automation",
    items: [
      "LangGraph agents & RAG pipelines",
      "Voice agents with LiveKit",
      "Claude-certified automation architecture",
    ],
  },
  {
    id: "integrations",
    title: "Systems That Earn",
    items: [
      "Salesforce, QuickBooks & Stripe integrations",
      "GEO / AI-search visibility tooling",
      "Shipping to funded startups & law firms",
    ],
  },
];

export type Honor = {
  text: string;
  /** optional external link — renders the honor as a link when present */
  href?: string;
};

export const honors: Honor[] = [
  {
    text: "Claude Certified Architect — verified Anthropic credential",
    href: "https://www.credly.com/badges/deb0df5f-0e90-4bfc-974d-43996518ad3e/public_url",
  },
  { text: "Built BrandRadar.ai for a Forbes 40 Under 40 founder" },
  { text: "Shipped gradial.com for Gradial, a $35M-funded AI marketing platform" },
  {
    text: "$20k+ earned on Upwork with clients across the US, Europe & Australia",
    href: "https://upwork.com/freelancers/aakarshs",
  },
  { text: "500 problems solved on LeetCode" },
  { text: "Hackathon winner — college edition" },
  {
    text: "AI automation creator on YouTube — build walkthroughs & freelancing guidance",
    href: "https://www.youtube.com/@Aakarsh_Sharma",
  },
];

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  endDate: string;
};

export const education: EducationEntry[] = [
  {
    id: "bachelors",
    school: "Solan, Himachal Pradesh",
    degree: "Bachelor of Computer Science",
    endDate: "2021",
  },
  {
    id: "senior-secondary",
    school: "Himachal Pradesh",
    degree: "Senior Secondary (Class XII) — 93%",
    endDate: "2017",
  },
];

export type CandidatePreference = {
  workAuthorization: string;
  employmentTypes: string;
  workMode: string;
  noticePeriod: string;
  compensation: string;
  targetRole: string;
  preferredLocations: string[];
  timezone: string;
  decisionFactors: string[];
  travel: string;
  contactPreference: string;
};

export const candidatePreferences: CandidatePreference = {
  workAuthorization:
    "Based in India, working remotely with teams across the US, Europe, and Australia.",
  employmentTypes:
    "Open to full-time, contract, or consulting opportunities globally.",
  workMode:
    "Remote-first. Open to relocating to Europe for roles that include visa sponsorship.",
  noticePeriod: "Available at short notice — happy to discuss timelines.",
  compensation: "Targeting $35,000 – $40,000 USD per year.",
  targetRole: "Full-Stack Developer / AI Automation Engineer.",
  preferredLocations: ["Remote", "Europe (with visa sponsorship)"],
  timezone:
    "IST (UTC+5:30) — regularly overlapping US, EU, and Australian hours.",
  decisionFactors: [
    "Product ownership",
    "Engineering quality",
    "Remote flexibility",
    "Compensation",
    "Visa sponsorship (for EU roles)",
  ],
  travel: "Open to travel and to relocating for the right role.",
  contactPreference: "Prefer email or LinkedIn DM.",
};

export const contact = {
  intro: "ping me — fastest is email.",
  links: [
    {
      id: "email",
      label: "email",
      value: "sharmaaakarsh120@gmail.com",
      href: "mailto:sharmaaakarsh120@gmail.com",
    },
    {
      id: "github",
      label: "github",
      value: "@karshdev",
      href: "https://github.com/karshdev",
    },
    {
      id: "linkedin",
      label: "linkedin",
      value: "in/aakarsh-sharma-039a8a209",
      href: "https://www.linkedin.com/in/aakarsh-sharma-039a8a209/",
    },
    {
      id: "upwork",
      label: "upwork",
      value: "upwork.com/freelancers/aakarshs",
      href: "https://upwork.com/freelancers/aakarshs",
    },
    {
      id: "youtube",
      label: "youtube",
      value: "@Aakarsh_Sharma",
      href: "https://www.youtube.com/@Aakarsh_Sharma",
    },
  ],
  outro: "exit 0 — let's build something.",
};

/** Attributed pull-quote rendered between projects and experience. */
export const quote = {
  parts: [
    { text: "Code. " },
    { text: "Products. ", tone: "ember" },
    { text: "Problems worth " },
    { text: "solving", tone: "amber" },
    { text: "." },
  ],
  attribution: "Aakarsh Sharma",
  footnote:
    "Everything else is noise. The job is to find the problem worth solving, then ship the thing that solves it.",
};
