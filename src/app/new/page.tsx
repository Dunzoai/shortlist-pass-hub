import { SiteHeader } from "@/components/new-home/SiteHeader";
import { ShortyHero } from "@/components/new-home/ShortyHero";

export default function NewHomePage() {
  return (
    <main className="min-h-screen bg-[#ebdcc0] font-[family-name:var(--font-sans-inter)] text-[#1d1a16]">
      <SiteHeader />
      <ShortyHero />
    </main>
  );
}
