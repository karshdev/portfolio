export type ProjectId =
  | "brandradar"
  | "dormotech"
  | "gradial"
  | "osbot"
  | "verdictstrike"
  | "outlook";

export type ProjectStatus = "RUNNING" | "ARCHIVED" | "PRIVATE";

export type Project = {
  id: ProjectId;
  /** display title, e.g. "BrandRadar" */
  title: string;
  /** path-like sub-label shown after the title, e.g. "./brandradar" */
  pathLabel: string;
  url: string;
  /** optional source repo (rendered alongside the deployment URL for OSS projects) */
  repoUrl?: string;
  /** optional YouTube walkthrough — adds a "demo" tab to the live viewer */
  videoUrl?: string;
  image: string;
  blurb: string;
  longBlurb: string;
  stack: string[];
  status: ProjectStatus;
  pid: string;
};

const seed = (s: string) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16).slice(0, 4).padStart(4, "0");
};

const make = (p: Omit<Project, "pid">): Project => ({ ...p, pid: `0x${seed(p.id)}` });

export const projects: Project[] = [
  make({
    id: "brandradar",
    title: "BrandRadar",
    pathLabel: "./brandradar",
    url: "https://www.brandradar.ai/",
    videoUrl: "https://www.youtube.com/watch?v=aofxQ6HQuO8",
    image: "/images/brandradar.png",
    blurb: "Does your brand show up when people ask AI?",
    longBlurb:
      "A unified discovery platform for generative engine optimization — tracking, page optimization, content, and authority building in one growth system. Built end to end for a Forbes 40 Under 40 founder: the marketing site plus the full product app at app.brandradar.ai.",
    stack: ["Next.js", "TypeScript", "GEO", "AI Search", "Product"],
    status: "RUNNING",
  }),
  make({
    id: "dormotech",
    title: "DormoVision X",
    pathLabel: "./dormotech",
    url: "https://dormotech.com/",
    image: "/images/dormotech.png",
    blurb: "Every sleep study, one platform.",
    longBlurb:
      "Home PSG and In-Lab PSG unified into a single connected clinical ecosystem, supporting up to 22 direct and 7 derived channels per study. Angular front end on an event-driven NestJS backend, with SQS and Redis orchestrating processing and PostgreSQL on AWS underneath.",
    stack: ["Angular", "NestJS", "AWS", "Redis", "SQS", "HealthTech"],
    status: "RUNNING",
  }),
  make({
    id: "gradial",
    title: "Gradial",
    pathLabel: "./gradial",
    url: "https://www.gradial.com/",
    image: "/images/gradial.png",
    blurb: "Platform site for a $35M-funded AI marketing company.",
    longBlurb:
      "Gradial's agents automate manual marketing operations to drive growth, AI-search visibility, and brand governance. I built the public platform site in React, driven by GraphQL against a Contentful CMS, shipped while the company closed a $35M round.",
    stack: ["React", "GraphQL", "Contentful", "CMS"],
    status: "RUNNING",
  }),
  make({
    id: "osbot",
    title: "OSBot",
    pathLabel: "./osbot",
    url: "https://osbot.exceleratelegal.com/",
    videoUrl: "https://youtu.be/l-HFwKRu47Y",
    image: "/images/osbot.png",
    blurb: "24/7 AI voice receptionist for personal-injury law firms.",
    longBlurb:
      "An operating-system agent for law firm owners — call in while driving and ask for case counts, pipeline value, or settlement status. Wired into Salesforce, NuLaw CRM, GoHighLevel, and QuickBooks so every answer comes from a live system of record rather than a stale export, with a real-time analytics dashboard behind it.",
    stack: ["Voice AI", "Agents", "Salesforce", "NuLaw", "QuickBooks"],
    status: "RUNNING",
  }),
  make({
    id: "verdictstrike",
    title: "VerdictStrike",
    pathLabel: "./verdictstrike",
    url: "https://verdictstrike.com/",
    image: "/images/verdictstrike.png",
    blurb: "AI operating system for diminished value claims.",
    longBlurb:
      "The first AI-powered platform helping law firms identify, value, negotiate, and settle diminished-value claims — from intake through insurance settlement. I contributed the appraiser-facing workflows for getting claims reviewed and signed.",
    stack: ["AI", "LegalTech", "Workflow", "Next.js"],
    status: "RUNNING",
  }),
  make({
    id: "outlook",
    title: "AI Outlook Assistant",
    pathLabel: "./outlook",
    url: "https://www.youtube.com/watch?v=Jm5B4kxkVOU",
    videoUrl: "https://www.youtube.com/watch?v=Jm5B4kxkVOU",
    image: "/images/outlook.png",
    blurb: "Auto-categorize, draft, and reply to email.",
    longBlurb:
      "An AI assistant that reads an Outlook inbox, categorizes incoming mail, drafts contextual replies, and sends them once approved. Built as a Claude Certified Architect and published as a full walkthrough so anyone can rebuild it.",
    stack: ["Claude", "AI Agents", "Automation", "Outlook"],
    status: "RUNNING",
  }),
];

export const getProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);
