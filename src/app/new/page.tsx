import { SiteHeader } from "@/components/new-home/SiteHeader";
import { ShortyHero } from "@/components/new-home/ShortyHero";
import { PipesSection } from "@/components/new-home/PipesSection";
import { SkillsSection } from "@/components/new-home/SkillsSection";
import { AudienceProvider } from "@/components/new-home/audience";

export default function NewHomePage() {
  return (
    <main className="min-h-screen bg-[#f5eddc] font-[family-name:var(--font-sans-inter)] text-[#1d1a16]">
      <AudienceProvider>
        <SiteHeader />
        <ShortyHero />
        {/* HOA version plugs in here: read useAudience() and pass HOA copy/scene. For now both views show the same section. */}
        <PipesSection />
        <SkillsSection />
      </AudienceProvider>
    </main>
  );
}
