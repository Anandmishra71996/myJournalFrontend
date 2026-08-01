import type { Metadata } from "next";
import { ToolsHeader, ToolsFooter } from "@/components/tools/ToolsChrome";
import BurnoutCheckClient from "@/components/tools/BurnoutCheckClient";
import { BRAND_NAME } from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: `Free Burnout & Resilience Check | ${BRAND_NAME}`,
  description:
    "6 quick questions and one honest sentence about what's draining you. Get a free burnout risk read, a resilience score, and 3 micro-actions for this week. No login required.",
};

export default function BurnoutCheckPage() {
  return (
    <main className="min-h-screen bg-background text-[color:var(--color-text-primary)]">
      <ToolsHeader />
      <BurnoutCheckClient />
      <ToolsFooter />
    </main>
  );
}
