export interface PublicToolMeta {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    status: "live" | "coming-soon";
}

export const PUBLIC_TOOLS: PublicToolMeta[] = [
    {
        slug: "personality-from-writing",
        name: "AI Personality From Your Writing",
        tagline: "Paste anything you've written. Get your Big Five profile.",
        description:
            "Paste 150+ words of anything you've written — a journal entry, an email, an essay — and get a Big Five (OCEAN) personality read, backed by quotes from your own text.",
        status: "live",
    },
    {
        slug: "behavior-check",
        name: "Behavioral Metrics Snapshot",
        tagline: "Action ratio, mindset, and locus of control from one paragraph.",
        description:
            "Describe your last 7 days and get the same behavioral metrics we compute weekly for members — Action Ratio, Mindset, Locus of Control, and Procrastination Signal.",
        status: "live",
    },
    {
        slug: "burnout-check",
        name: "Burnout & Resilience Check",
        tagline: "6 quick questions. A burnout risk gauge and 3 micro-actions.",
        description:
            "A quick, private check on burnout risk and resilience, with personalized micro-actions. Not medical advice — a starting point for self-reflection.",
        status: "live",
    },
];
