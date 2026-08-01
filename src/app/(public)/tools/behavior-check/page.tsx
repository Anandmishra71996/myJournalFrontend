import type { Metadata } from "next";
import { ToolsHeader, ToolsFooter } from "@/components/tools/ToolsChrome";
import BehaviorCheckClient from "@/components/tools/BehaviorCheckClient";
import { BRAND_NAME } from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: `Free Behavioral Metrics Snapshot | ${BRAND_NAME}`,
  description:
    "Answer 3 quick questions about your last 7 days and get your Action Ratio, Mindset, Locus of Control, and Procrastination Signal — free, no login required.",
};

export default function BehaviorCheckPage() {
  return (
    <main className="min-h-screen bg-background text-[color:var(--color-text-primary)]">
      <ToolsHeader />
      <BehaviorCheckClient />
      <ToolsFooter />
    </main>
  );
}
