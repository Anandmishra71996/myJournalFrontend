export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date, e.g. "2026-07-22"
  updatedAt?: string;
  tags: string[];
  readingTimeMinutes: number;
  content: string; // markdown body
}
