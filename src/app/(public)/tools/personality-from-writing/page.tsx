import type { Metadata } from "next";
import { ToolsHeader, ToolsFooter } from "@/components/tools/ToolsChrome";
import PersonalityFromWritingClient from "@/components/tools/PersonalityFromWritingClient";
import { BRAND_NAME } from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: `AI Personality Test From Your Writing (Free) | ${BRAND_NAME}`,
  description:
    "Paste anything you've written and get a free Big Five (OCEAN) personality analysis, with insights backed by quotes from your own text. No login required.",
};

export default function PersonalityFromWritingPage() {
  return (
    <main className="min-h-screen bg-background text-[color:var(--color-text-primary)]">
      <ToolsHeader />
      <PersonalityFromWritingClient />
      <ToolsFooter />
    </main>
  );
}
