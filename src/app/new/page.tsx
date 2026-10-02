import { SiteHeader } from "@/components/new-home/SiteHeader";
import { ShortyHero } from "@/components/new-home/ShortyHero";
import { AudienceProvider } from "@/components/new-home/audience";

export default function NewHomePage() {
  return (
    <main className="min-h-screen bg-[#f0e5cf] font-[family-name:var(--font-sans-inter)] text-[#1d1a16]">
      <AudienceProvider>
        <SiteHeader />
        <ShortyHero />
      </AudienceProvider>
    </main>
  );
}
